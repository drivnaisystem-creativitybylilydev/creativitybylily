import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';
import { ShippingConfirmationEmail } from '@/emails/ShippingConfirmation';
import { ReturnRequestReceivedEmail } from '@/emails/ReturnRequestReceived';
import { ReturnApprovedEmail } from '@/emails/ReturnApproved';
import { RefundProcessedEmail } from '@/emails/RefundProcessed';

// Only allow in development
export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const emailType = searchParams.get('type') || 'order';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Sample data for preview
  const sampleData = {
    orderNumber: 'ORD-12345',
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    items: [
      {
        productId: '1',
        productTitle: 'Cape Cod Bracelet',
        productImage: `${siteUrl}/products/bracelets/Cape Cod BRACELET 14k gold filled and sterling silver/1.webp`,
        variantName: 'Gold',
        quantity: 2,
        price: 45.00,
      },
      {
        productId: '2',
        productTitle: 'Turquoise Necklace',
        productImage: `${siteUrl}/products/necklaces/1.webp`,
        quantity: 1,
        price: 65.00,
      },
    ],
    subtotal: 155.00,
    tax: 12.40,
    shipping: 5.99,
    total: 173.39,
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Doe',
      address: '123 Main Street',
      address2: 'Apt 4B',
      city: 'Boston',
      state: 'MA',
      zip: '02101',
      country: 'United States',
    },
    returnNumber: 'RET-67890',
    trackingNumber: '9400111899223197428490',
    carrier: 'USPS',
    estimatedDelivery: 'December 28, 2024',
    refundAmount: 155.00,
    returnAddress: {
      name: 'Creativity by Lily Returns',
      address: '456 Return Street',
      city: 'Cape Cod',
      state: 'MA',
      zip: '02601',
      country: 'United States',
    },
    refundTransactionId: 'ref_abc123xyz',
  };

  let emailHtml = '';

  try {
    switch (emailType) {
      case 'order':
        emailHtml = render(
          OrderConfirmationEmail({
            orderNumber: sampleData.orderNumber,
            customerName: sampleData.customerName,
            customerEmail: sampleData.customerEmail,
            items: sampleData.items,
            subtotal: sampleData.subtotal,
            tax: sampleData.tax,
            shipping: sampleData.shipping,
            total: sampleData.total,
            shippingAddress: sampleData.shippingAddress,
            siteUrl,
          })
        );
        break;

      case 'shipping':
        emailHtml = render(
          ShippingConfirmationEmail({
            orderNumber: sampleData.orderNumber,
            customerName: sampleData.customerName,
            trackingNumber: sampleData.trackingNumber,
            carrier: sampleData.carrier,
            estimatedDelivery: sampleData.estimatedDelivery,
            items: sampleData.items.map((item) => ({
              productTitle: item.productTitle,
              quantity: item.quantity,
            })),
            siteUrl,
          })
        );
        break;

      case 'return-request':
        emailHtml = render(
          ReturnRequestReceivedEmail({
            returnNumber: sampleData.returnNumber,
            customerName: sampleData.customerName,
            customerEmail: sampleData.customerEmail,
            orderNumber: sampleData.orderNumber,
            refundAmount: sampleData.refundAmount,
            items: sampleData.items.map((item) => ({
              productTitle: item.productTitle,
              quantity: item.quantity,
              price: item.price,
            })),
            siteUrl,
          })
        );
        break;

      case 'return-approved':
        emailHtml = render(
          ReturnApprovedEmail({
            returnNumber: sampleData.returnNumber,
            customerName: sampleData.customerName,
            returnAddress: sampleData.returnAddress,
            refundAmount: sampleData.refundAmount,
            siteUrl,
          })
        );
        break;

      case 'refund':
        emailHtml = render(
          RefundProcessedEmail({
            returnNumber: sampleData.returnNumber,
            customerName: sampleData.customerName,
            refundAmount: sampleData.refundAmount,
            refundTransactionId: sampleData.refundTransactionId,
            siteUrl,
          })
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type. Use: order, shipping, return-request, return-approved, refund' },
          { status: 400 }
        );
    }

    return new NextResponse(emailHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    console.error('Error rendering email:', error);
    return NextResponse.json(
      { error: 'Error rendering email', details: error?.message },
      { status: 500 }
    );
  }
}



