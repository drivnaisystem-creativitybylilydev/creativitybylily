import { Section, Text, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, EmailFooterSignature, emailStyles } from './shared/EmailLayout';
import { getEmailSiteUrl } from './shared/emailSiteUrl';
import { getCarrierTrackingUrl } from '@/lib/carriers';

interface ShippingConfirmationProps {
  orderNumber: string;
  customerName: string;
  trackingNumber: string;
  carrier?: string;
  estimatedDelivery?: string;
  items: Array<{ productTitle: string; quantity: number }>;
  siteUrl?: string;
}

export const ShippingConfirmationEmail = ({
  orderNumber,
  customerName,
  trackingNumber,
  carrier,
  estimatedDelivery,
  items,
  siteUrl = 'https://creativitybylilyco.com',
}: ShippingConfirmationProps) => {
  const url = getEmailSiteUrl(siteUrl);
  const hasTracking = Boolean(trackingNumber?.trim());
  return (
    <EmailLayout siteUrl={siteUrl}>
      <Section style={emailStyles.content}>
        <Text style={emailStyles.heading}>Your Order Has Shipped! 📦</Text>
        <Text style={emailStyles.paragraph}>Hi {customerName},</Text>
        <Text style={emailStyles.paragraph}>
          Great news! Your order <strong>{orderNumber}</strong> is on its way to you.
        </Text>
      </Section>

      <Section style={emailStyles.addressBox}>
        <Text style={emailStyles.sectionHeading}>Tracking Information</Text>
        {hasTracking ? (
          <>
            <Text style={trackingNumberStyle}>
              <strong>Tracking Number:</strong> {trackingNumber.trim()}
            </Text>
            {carrier && (
              <Text style={emailStyles.paragraph}>
                <strong>Carrier:</strong> {carrier.toUpperCase()}
              </Text>
            )}
            {estimatedDelivery && (
              <Text style={emailStyles.paragraph}>
                <strong>Estimated Delivery:</strong> {estimatedDelivery}
              </Text>
            )}
            <Text style={emailStyles.paragraph}>
              <Link href={getCarrierTrackingUrl(carrier, trackingNumber)} style={trackingLink}>
                Track Your Package →
              </Link>
            </Text>
          </>
        ) : (
          <Text style={emailStyles.paragraph}>
            Your tracking number will appear in your account shortly, or we will email you again if needed.
          </Text>
        )}
      </Section>

      <Section style={{ padding: '0 24px' }}>
        <Text style={emailStyles.sectionHeading}>Items in This Shipment</Text>
        {items.map((item, index) => (
          <Text key={index} style={itemText}>
            • {item.productTitle} (Qty: {item.quantity})
          </Text>
        ))}
      </Section>

      <Section style={emailStyles.footer}>
        <Text style={emailStyles.footerText}>We hope you love your new jewelry! If you have any questions, feel free to reach out to us.</Text>
        <Text style={emailStyles.footerText}>
          <Link href={`${url}/account`} style={emailStyles.footerLink}>View Order Details</Link>
        </Text>
        <EmailFooterSignature />
      </Section>
    </EmailLayout>
  );
};

const trackingNumberStyle = { fontSize: '18px', fontWeight: 600, color: '#2d2d2d', margin: '0 0 12px', fontFamily: 'monospace' };
const trackingLink = { color: '#ff72a6', textDecoration: 'underline', fontSize: '16px' };
const itemText = { fontSize: '16px', lineHeight: '24px', color: '#2d2d2d', margin: '0 0 8px' };

export default ShippingConfirmationEmail;
