import { Section, Text, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, EmailFooterSignature, emailStyles } from './shared/EmailLayout';
import { getEmailSiteUrl } from './shared/emailSiteUrl';

interface DeliveryConfirmationProps {
  orderNumber: string;
  customerName: string;
  trackingNumber: string;
  carrier?: string;
  items: Array<{ productTitle: string; quantity: number }>;
  siteUrl?: string;
}

export const DeliveryConfirmationEmail = ({
  orderNumber,
  customerName,
  trackingNumber,
  carrier,
  items,
  siteUrl = 'https://creativitybylilyco.com',
}: DeliveryConfirmationProps) => {
  const url = getEmailSiteUrl(siteUrl);
  const hasTracking = Boolean(trackingNumber?.trim());
  return (
    <EmailLayout siteUrl={siteUrl}>
      <Section style={emailStyles.content}>
        <Text style={emailStyles.heading}>Your Order Has Arrived! 🎉</Text>
        <Text style={emailStyles.paragraph}>Hi {customerName},</Text>
        <Text style={emailStyles.paragraph}>
          Great news! Your order <strong>{orderNumber}</strong> was just delivered.
        </Text>
      </Section>

      {hasTracking && (
        <Section style={emailStyles.addressBox}>
          <Text style={emailStyles.sectionHeading}>Delivery Information</Text>
          <Text style={trackingNumberStyle}>
            <strong>Tracking Number:</strong> {trackingNumber.trim()}
          </Text>
          {carrier && (
            <Text style={emailStyles.paragraph}>
              <strong>Carrier:</strong> {carrier.toUpperCase()}
            </Text>
          )}
          <Text style={emailStyles.paragraph}>
            <Link
              href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(trackingNumber.trim())}`}
              style={trackingLink}
            >
              View Delivery Details →
            </Link>
          </Text>
        </Section>
      )}

      <Section style={{ padding: '0 24px' }}>
        <Text style={emailStyles.sectionHeading}>Items in This Order</Text>
        {items.map((item, index) => (
          <Text key={index} style={itemText}>
            • {item.productTitle} (Qty: {item.quantity})
          </Text>
        ))}
      </Section>

      <Section style={emailStyles.footer}>
        <Text style={emailStyles.footerText}>
          We hope you love your new jewelry! If anything arrived damaged or isn&apos;t quite right, just reply to
          this email and we&apos;ll make it right.
        </Text>
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

export default DeliveryConfirmationEmail;
