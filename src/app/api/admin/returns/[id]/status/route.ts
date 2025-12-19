import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendReturnApprovedEmail, sendRefundProcessedEmail } from '@/lib/email';

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

    // Get return with order details for email
    const { data: returnData, error: fetchError } = await supabase
      .from('returns')
      .select(`
        *,
        orders (
          customer_email,
          customer_first_name,
          customer_last_name,
          order_number
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
            refundTransactionId: returnData.refund_transaction_id || undefined,
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
