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

interface ReturnRequestReceivedProps {
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
  siteUrl?: string;
}

export const ReturnRequestReceivedEmail = ({
  returnNumber,
  customerName,
  customerEmail,
  orderNumber,
  refundAmount,
  items,
  siteUrl = 'https://creativitybylily.com',
}: ReturnRequestReceivedProps) => {
  const logoPink = '#ff72a6';
  const softPink = '#f8e8e8';

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
            <Text style={heading}>Return Request Received</Text>
            <Text style={paragraph}>
              Hi {customerName},
            </Text>
            <Text style={paragraph}>
              We've received your return request for order <strong>{orderNumber}</strong>. Our team will review it shortly and you'll receive an update within 1-2 business days.
            </Text>
            <Text style={paragraph}>
              <strong>Return Number:</strong> {returnNumber}
            </Text>
          </Section>

          {/* Return Items */}
          <Section style={itemsSection}>
            <Text style={sectionHeading}>Items to Return</Text>
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

          {/* Refund Amount */}
          <Section style={summarySection}>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Expected Refund:</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>${refundAmount.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              We'll notify you once your return has been reviewed. If you have any questions, feel free to reach out to us.
            </Text>
            <Text style={footerText}>
              <Link href={`${siteUrl}/account`} style={footerLink}>
                View Return Status
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

// Reuse styles from OrderConfirmation
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

const itemsSection = {
  padding: '0 24px',
};

const sectionHeading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#2d2d2d',
  margin: '0 0 20px',
};

const itemRow = {
  marginBottom: '16px',
  paddingBottom: '16px',
  borderBottom: '1px solid #f0f0f0',
};

const itemTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2d2d2d',
  margin: '0 0 4px',
};

const itemQuantity = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 4px',
};

const itemPrice = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#ff72a6',
  margin: '8px 0 0',
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

export default ReturnRequestReceivedEmail;



