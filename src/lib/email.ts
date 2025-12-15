import { Resend } from 'resend';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';

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

