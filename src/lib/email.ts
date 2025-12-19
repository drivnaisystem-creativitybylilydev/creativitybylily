import { Resend } from 'resend';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';
import { ReturnRequestReceivedEmail } from '@/emails/ReturnRequestReceived';
import { ReturnApprovedEmail } from '@/emails/ReturnApproved';
import { RefundProcessedEmail } from '@/emails/RefundProcessed';
import { ShippingConfirmationEmail } from '@/emails/ShippingConfirmation';

// Lazy initialization - only create Resend client when needed
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  
  // Debug: Check if API key is being read (only log once)
  if (!apiKey && !resend) {
    console.log('⚠️  RESEND_API_KEY not found in environment variables');
    console.log('   Make sure .env.local exists and contains RESEND_API_KEY=re_...');
    console.log('   Restart your dev server after adding environment variables');
    return null;
  }
  
  if (!apiKey) {
    return null;
  }
  
  if (!resend) {
    resend = new Resend(apiKey);
  }
  return resend;
}

interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  variantId?: string | null;
  variantName?: string | null;
  quantity: number;
  price: number;
}

interface SendOrderConfirmationParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export async function sendOrderConfirmationEmail({
  orderNumber,
  customerName,
  customerEmail,
  items,
  subtotal,
  tax,
  shipping,
  total,
  shippingAddress,
}: SendOrderConfirmationParams) {
  // Check if we have API key - if not, just log (development mode)
  const client = getResendClient();
  if (!client || !process.env.RESEND_FROM_EMAIL) {
    // Development mode: Just log the email instead of sending
    console.log('📧 [DEV MODE] Order Confirmation Email would be sent:');
    console.log('   To:', customerEmail);
    console.log('   Order:', orderNumber);
    console.log('   Items:', items.length);
    console.log('   Total: $' + total.toFixed(2));
    console.log('\n   To enable real emails:');
    console.log('   1. Set up Resend account and verify domain');
    console.log('   2. Add RESEND_API_KEY and RESEND_FROM_EMAIL to .env.local');
    return { success: true, data: { devMode: true } };
  }

  try {
    // Render email template (render is synchronous)
    const emailHtml = render(
      OrderConfirmationEmail({
        orderNumber,
        customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        customerEmail,
        items,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://creativitybylily.com',
      })
    );

    const { data, error } = await client.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: customerEmail,
      subject: `Order Confirmation - ${orderNumber} | creativity by lily`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error rendering/sending email:', error);
    return { success: false, error };
  }
}

// Return Request Received Email
interface SendReturnRequestReceivedParams {
  returnNumber: string;
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  refundAmount: number;
  items: Array<{
    productTitle: string;
    quantity: number;
    price: number;
  }>;
}

export async function sendReturnRequestReceivedEmail({
  returnNumber,
  customerName,
  customerEmail,
  orderNumber,
  refundAmount,
  items,
}: SendReturnRequestReceivedParams) {
  const client = getResendClient();
  if (!client || !process.env.RESEND_FROM_EMAIL) {
    console.log('📧 [DEV MODE] Return Request Received Email would be sent:');
    console.log('   To:', customerEmail);
    console.log('   Return:', returnNumber);
    return { success: true, data: { devMode: true } };
  }

  try {
    const emailHtml = render(
      ReturnRequestReceivedEmail({
        returnNumber,
        customerName,
        customerEmail,
        orderNumber,
        refundAmount,
        items,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://creativitybylily.com',
      })
    );

    const { data, error } = await client.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: customerEmail,
      subject: `Return Request Received - ${returnNumber} | creativity by lily`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error rendering/sending email:', error);
    return { success: false, error };
  }
}

// Return Approved Email
interface SendReturnApprovedParams {
  returnNumber: string;
  customerName: string;
  customerEmail: string;
  returnAddress: {
    name?: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  refundAmount: number;
}

export async function sendReturnApprovedEmail({
  returnNumber,
  customerName,
  customerEmail,
  returnAddress,
  refundAmount,
}: SendReturnApprovedParams) {
  const client = getResendClient();
  if (!client || !process.env.RESEND_FROM_EMAIL) {
    console.log('📧 [DEV MODE] Return Approved Email would be sent:');
    console.log('   To:', customerEmail);
    console.log('   Return:', returnNumber);
    return { success: true, data: { devMode: true } };
  }

  try {
    const emailHtml = render(
      ReturnApprovedEmail({
        returnNumber,
        customerName,
        returnAddress,
        refundAmount,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://creativitybylily.com',
      })
    );

    const { data, error } = await client.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: customerEmail,
      subject: `Return Approved - ${returnNumber} | creativity by lily`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error rendering/sending email:', error);
    return { success: false, error };
  }
}

// Refund Processed Email
interface SendRefundProcessedParams {
  returnNumber: string;
  customerName: string;
  customerEmail: string;
  refundAmount: number;
  refundTransactionId?: string;
}

export async function sendRefundProcessedEmail({
  returnNumber,
  customerName,
  customerEmail,
  refundAmount,
  refundTransactionId,
}: SendRefundProcessedParams) {
  const client = getResendClient();
  if (!client || !process.env.RESEND_FROM_EMAIL) {
    console.log('📧 [DEV MODE] Refund Processed Email would be sent:');
    console.log('   To:', customerEmail);
    console.log('   Return:', returnNumber);
    console.log('   Amount: $' + refundAmount.toFixed(2));
    return { success: true, data: { devMode: true } };
  }

  try {
    const emailHtml = render(
      RefundProcessedEmail({
        returnNumber,
        customerName,
        refundAmount,
        refundTransactionId,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://creativitybylily.com',
      })
    );

    const { data, error } = await client.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: customerEmail,
      subject: `Refund Processed - ${returnNumber} | creativity by lily`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error rendering/sending email:', error);
    return { success: false, error };
  }
}

// Shipping Confirmation Email
interface SendShippingConfirmationParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  carrier?: string;
  estimatedDelivery?: string;
  items: Array<{
    productTitle: string;
    quantity: number;
  }>;
}

export async function sendShippingConfirmationEmail({
  orderNumber,
  customerName,
  customerEmail,
  trackingNumber,
  carrier,
  estimatedDelivery,
  items,
}: SendShippingConfirmationParams) {
  const client = getResendClient();
  if (!client || !process.env.RESEND_FROM_EMAIL) {
    console.log('📧 [DEV MODE] Shipping Confirmation Email would be sent:');
    console.log('   To:', customerEmail);
    console.log('   Order:', orderNumber);
    console.log('   Tracking:', trackingNumber);
    return { success: true, data: { devMode: true } };
  }

  try {
    const emailHtml = render(
      ShippingConfirmationEmail({
        orderNumber,
        customerName,
        trackingNumber,
        carrier,
        estimatedDelivery,
        items,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://creativitybylily.com',
      })
    );

    const { data, error } = await client.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: customerEmail,
      subject: `Your Order Has Shipped - ${orderNumber} | creativity by lily`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error rendering/sending email:', error);
    return { success: false, error };
  }
}

