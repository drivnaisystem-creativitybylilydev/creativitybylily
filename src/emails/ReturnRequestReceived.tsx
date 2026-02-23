import { Section, Row, Column, Text, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, EmailFooterSignature, emailStyles } from './shared/EmailLayout';

interface ReturnRequestReceivedProps {
  returnNumber: string;
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  refundAmount: number;
  items: Array<{ productTitle: string; quantity: number; price: number }>;
  siteUrl?: string;
}

export const ReturnRequestReceivedEmail = ({
  returnNumber,
  customerName,
  customerEmail,
  orderNumber,
  refundAmount,
  items,
  siteUrl = 'https://creativitybylilyco.com',
}: ReturnRequestReceivedProps) => {
  const url = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
  return (
    <EmailLayout siteUrl={siteUrl}>
      <Section style={emailStyles.content}>
        <Text style={emailStyles.heading}>Return Request Received</Text>
        <Text style={emailStyles.paragraph}>Hi {customerName},</Text>
        <Text style={emailStyles.paragraph}>
          We've received your return request for order <strong>{orderNumber}</strong>. Our team will review it shortly and you'll receive an update within 1–2 business days.
        </Text>
        <Text style={emailStyles.paragraph}><strong>Return Number:</strong> {returnNumber}</Text>
      </Section>

      <Section style={{ padding: '0 24px' }}>
        <Text style={emailStyles.sectionHeading}>Items to Return</Text>
        {items.map((item, index) => (
          <Section key={index} style={itemRow}>
            <Row>
              <Column>
                <Text style={itemTitle}>{item.productTitle}</Text>
                <Text style={itemQuantity}>Quantity: {item.quantity}</Text>
                <Text style={itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>
        ))}
      </Section>

      <Section style={{ padding: '0 24px' }}>
        <Row style={emailStyles.totalRow}>
          <Column><Text style={emailStyles.totalLabel}>Expected Refund:</Text></Column>
          <Column align="right"><Text style={emailStyles.totalValue}>${refundAmount.toFixed(2)}</Text></Column>
        </Row>
      </Section>

      <Section style={emailStyles.footer}>
        <Text style={emailStyles.footerText}>We'll notify you once your return has been reviewed. If you have any questions, feel free to reach out to us.</Text>
        <Text style={emailStyles.footerText}>
          <Link href={`${url}/account`} style={emailStyles.footerLink}>View Return Status</Link>
        </Text>
        <EmailFooterSignature />
      </Section>
    </EmailLayout>
  );
};

const itemRow = { marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' };
const itemTitle = { fontSize: '16px', fontWeight: 600, color: '#2d2d2d', margin: '0 0 4px' };
const itemQuantity = { fontSize: '14px', color: '#666', margin: '0 0 4px' };
const itemPrice = { fontSize: '16px', fontWeight: 600, color: '#ff72a6', margin: '8px 0 0' };

export default ReturnRequestReceivedEmail;
