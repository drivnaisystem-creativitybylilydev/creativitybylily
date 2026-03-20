import { Section, Row, Column, Text, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, EmailFooterSignature, emailStyles } from './shared/EmailLayout';
import { getEmailSiteUrl } from './shared/emailSiteUrl';

interface RefundProcessedProps {
  returnNumber: string;
  customerName: string;
  refundAmount: number;
  refundTransactionId?: string;
  siteUrl?: string;
}

export const RefundProcessedEmail = ({
  returnNumber,
  customerName,
  refundAmount,
  refundTransactionId,
  siteUrl = 'https://creativitybylilyco.com',
}: RefundProcessedProps) => {
  const url = getEmailSiteUrl(siteUrl);
  return (
    <EmailLayout siteUrl={siteUrl}>
      <Section style={emailStyles.content}>
        <Text style={emailStyles.heading}>Refund Processed! 💰</Text>
        <Text style={emailStyles.paragraph}>Hi {customerName},</Text>
        <Text style={emailStyles.paragraph}>
          Your refund for return <strong>{returnNumber}</strong> has been processed successfully!
        </Text>
      </Section>

      <Section style={{ padding: '0 24px' }}>
        <Row style={emailStyles.totalRow}>
          <Column><Text style={emailStyles.totalLabel}>Refund Amount:</Text></Column>
          <Column align="right"><Text style={emailStyles.totalValue}>${refundAmount.toFixed(2)}</Text></Column>
        </Row>
        {refundTransactionId && (
          <Row style={{ marginTop: '12px' }}>
            <Column>
              <Text style={transactionId}>Transaction ID: {refundTransactionId}</Text>
            </Column>
          </Row>
        )}
      </Section>

      <Section style={emailStyles.addressBox}>
        <Text style={emailStyles.paragraph}>
          <strong>Processing Time:</strong> The refund has been issued to your original payment method. Please allow 5–7 business days for the refund to appear in your account, depending on your bank or credit card company.
        </Text>
      </Section>

      <Section style={emailStyles.footer}>
        <Text style={emailStyles.footerText}>Thank you for shopping with creativity by lily. We hope to see you again soon!</Text>
        <Text style={emailStyles.footerText}>
          <Link href={url} style={emailStyles.footerLink}>Visit our website</Link>
        </Text>
        <EmailFooterSignature />
      </Section>
    </EmailLayout>
  );
};

const transactionId = { fontSize: '14px', color: '#666', fontFamily: 'monospace', margin: '0' };

export default RefundProcessedEmail;
