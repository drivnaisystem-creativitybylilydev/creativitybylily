import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendReturnApprovedEmail, sendRefundProcessedEmail } from '@/lib/email';
import { Client, Environment } from 'square';
import type { RefundPaymentRequest, Money } from 'square';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'approved', 'shipped', 'received', 'processed', 'refunded', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const updateData: any = { status };
    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes;
    }

    // Get return with order details for email and refund processing
    const { data: returnData, error: fetchError } = await supabase
      .from('returns')
      .select(`
        *,
        orders (
          customer_email,
          customer_first_name,
          customer_last_name,
          order_number,
          payment_id,
          payment_intent_id
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching return:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch return', details: fetchError.message },
        { status: 500 }
      );
    }

    // If status is 'refunded', process refund through Square first
    let refundTransactionId: string | null = null;
    if (status === 'refunded') {
      const order = (returnData as any).orders;
      // Check both payment_id (Square) and payment_intent_id (legacy/Stripe)
      const paymentId = order?.payment_id || order?.payment_intent_id;

      if (!paymentId) {
        return NextResponse.json(
          { error: 'Cannot process refund: Original payment ID not found for this order' },
          { status: 400 }
        );
      }

      // Initialize Square client
      if (!process.env.SQUARE_ACCESS_TOKEN) {
        return NextResponse.json(
          { error: 'Square credentials not configured' },
          { status: 500 }
        );
      }

      const squareClient = new Client({
        environment: (process.env.SQUARE_ENVIRONMENT as Environment) || Environment.Production,
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
      });

      try {
        // Convert refund amount to cents (Square expects amount in smallest currency unit)
        const refundAmountCents = Math.round(returnData.refund_amount * 100);
        
        const refundMoney: Money = {
          amount: refundAmountCents,
          currency: 'USD',
        };

        // Create refund request
        const refundRequest: RefundPaymentRequest = {
          idempotencyKey: `refund-${returnData.id}-${Date.now()}`, // Unique key to prevent duplicate refunds
          amountMoney: refundMoney,
          paymentId: paymentId,
        };

        // Process refund through Square API
        const { result, statusCode } = await squareClient.refundsApi.refundPayment(refundRequest);

        if (statusCode !== 200 || !result.refund) {
          console.error('Square refund failed:', result);
          return NextResponse.json(
            {
              error: result.errors?.[0]?.detail || 'Refund processing failed',
              details: result.errors,
            },
            { status: statusCode || 500 }
          );
        }

        // Store refund transaction ID
        refundTransactionId = result.refund.id;
        updateData.refund_transaction_id = refundTransactionId;

        console.log('Refund processed successfully:', {
          refundId: refundTransactionId,
          amount: returnData.refund_amount,
          paymentId,
        });
      } catch (refundError: any) {
        console.error('Error processing Square refund:', refundError);
        return NextResponse.json(
          {
            error: 'Failed to process refund through Square',
            details: process.env.NODE_ENV === 'development' ? refundError?.message : undefined,
          },
          { status: 500 }
        );
      }
    }

    const { data, error } = await supabase
      .from('returns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating return status:', error);
      return NextResponse.json(
        { error: 'Failed to update return status', details: error.message },
        { status: 500 }
      );
    }

    // Send email notifications based on status
    try {
      const order = (returnData as any).orders;
      if (order && order.customer_email) {
        if (status === 'approved') {
          await sendReturnApprovedEmail({
            returnNumber: returnData.return_number,
            customerName: order.customer_first_name || 'Customer',
            customerEmail: order.customer_email,
            returnAddress: returnData.return_address || {},
            refundAmount: returnData.refund_amount,
          });
        } else if (status === 'refunded') {
          await sendRefundProcessedEmail({
            returnNumber: returnData.return_number,
            customerName: order.customer_first_name || 'Customer',
            customerEmail: order.customer_email,
            refundAmount: returnData.refund_amount,
            refundTransactionId: refundTransactionId || returnData.refund_transaction_id || undefined,
          });
        }
      }
    } catch (emailError) {
      console.error('Error sending status update email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, return: data });
  } catch (error: any) {
    console.error('Return status update error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}



