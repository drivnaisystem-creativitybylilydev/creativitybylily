import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Img,
  Link,
} from '@react-email/components';
import * as React from 'react';

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
  siteUrl = 'https://creativitybylily.com',
}: RefundProcessedProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Row>
              <Column>
                <Img
                  src={`${siteUrl}/brand_logo.webp`}
                  width="60"
                  height="60"
                  alt="creativity by lily"
                  style={logo}
                />
              </Column>
              <Column style={headerText}>
                <Text style={brandName}>creativity by lily</Text>
              </Column>
            </Row>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={heading}>Refund Processed! 💰</Text>
            <Text style={paragraph}>
              Hi {customerName},
            </Text>
            <Text style={paragraph}>
              Your refund for return <strong>{returnNumber}</strong> has been processed successfully!
            </Text>
          </Section>

          {/* Refund Details */}
          <Section style={summarySection}>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Refund Amount:</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>${refundAmount.toFixed(2)}</Text>
              </Column>
            </Row>
            {refundTransactionId && (
              <Row style={{ marginTop: '12px' }}>
                <Column>
                  <Text style={transactionId}>Transaction ID: {refundTransactionId}</Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Processing Time */}
          <Section style={infoSection}>
            <Text style={paragraph}>
              <strong>Processing Time:</strong> The refund has been issued to your original payment method. Please allow 5-7 business days for the refund to appear in your account, depending on your bank or credit card company.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Thank you for shopping with creativity by lily. We hope to see you again soon!
            </Text>
            <Text style={footerText}>
              <Link href={siteUrl} style={footerLink}>
                Visit our website
              </Link>
            </Text>
            <Text style={footerSignature}>
              With love from Cape Cod,<br />
              <span style={{ fontFamily: 'Dancing Script, cursive' }}>creativity by lily</span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Reuse styles
const main = {
  backgroundColor: '#fefcf9',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#f8e8e8',
  padding: '24px',
  textAlign: 'center' as const,
};

const logo = {
  borderRadius: '50%',
  margin: '0 auto',
  display: 'block',
};

const headerText = {
  verticalAlign: 'middle',
  paddingLeft: '12px',
};

const brandName = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#ff72a6',
  margin: '0',
  fontFamily: 'Dancing Script, cursive',
  lineHeight: '1.2',
};

const content = {
  padding: '32px 24px',
};

const heading = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#2d2d2d',
  margin: '0 0 16px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#2d2d2d',
  margin: '0 0 16px',
};

const summarySection = {
  padding: '0 24px',
};

const totalRow = {
  marginTop: '12px',
  paddingTop: '12px',
  borderTop: '2px solid #ff72a6',
};

const totalLabel = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2d2d2d',
  margin: '0',
};

const totalValue = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#ff72a6',
  margin: '0',
  textAlign: 'right' as const,
};

const transactionId = {
  fontSize: '14px',
  color: '#666',
  fontFamily: 'monospace',
  margin: '0',
};

const infoSection = {
  padding: '24px',
  backgroundColor: '#f7f0e8',
  borderRadius: '8px',
  margin: '24px',
};

const footer = {
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#666',
  margin: '0 0 12px',
};

const footerLink = {
  color: '#ff72a6',
  textDecoration: 'underline',
};

const footerSignature = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#2d2d2d',
  margin: '24px 0 0',
  fontStyle: 'italic',
};

export default RefundProcessedEmail;



