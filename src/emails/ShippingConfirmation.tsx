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

interface ShippingConfirmationProps {
  orderNumber: string;
  customerName: string;
  trackingNumber: string;
  carrier?: string;
  estimatedDelivery?: string;
  items: Array<{
    productTitle: string;
    quantity: number;
  }>;
  siteUrl?: string;
}

export const ShippingConfirmationEmail = ({
  orderNumber,
  customerName,
  trackingNumber,
  carrier,
  estimatedDelivery,
  items,
  siteUrl = 'https://creativitybylily.com',
}: ShippingConfirmationProps) => {
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
            <Text style={heading}>Your Order Has Shipped! 📦</Text>
            <Text style={paragraph}>
              Hi {customerName},
            </Text>
            <Text style={paragraph}>
              Great news! Your order <strong>{orderNumber}</strong> is on its way to you.
            </Text>
          </Section>

          {/* Tracking Info */}
          <Section style={trackingSection}>
            <Text style={sectionHeading}>Tracking Information</Text>
            <Text style={trackingNumber}>
              <strong>Tracking Number:</strong> {trackingNumber}
            </Text>
            {carrier && (
              <Text style={paragraph}>
                <strong>Carrier:</strong> {carrier.toUpperCase()}
              </Text>
            )}
            {estimatedDelivery && (
              <Text style={paragraph}>
                <strong>Estimated Delivery:</strong> {estimatedDelivery}
              </Text>
            )}
            <Text style={paragraph}>
              <Link href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`} style={trackingLink}>
                Track Your Package →
              </Link>
            </Text>
          </Section>

          {/* Items Shipped */}
          <Section style={itemsSection}>
            <Text style={sectionHeading}>Items in This Shipment</Text>
            {items.map((item, index) => (
              <Text key={index} style={itemText}>
                • {item.productTitle} (Qty: {item.quantity})
              </Text>
            ))}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              We hope you love your new jewelry! If you have any questions, feel free to reach out to us.
            </Text>
            <Text style={footerText}>
              <Link href={`${siteUrl}/account`} style={footerLink}>
                View Order Details
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

const trackingSection = {
  padding: '24px',
  backgroundColor: '#f7f0e8',
  borderRadius: '8px',
  margin: '24px',
};

const sectionHeading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#2d2d2d',
  margin: '0 0 20px',
};

const trackingNumber = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2d2d2d',
  margin: '0 0 12px',
  fontFamily: 'monospace',
};

const trackingLink = {
  color: '#ff72a6',
  textDecoration: 'underline',
  fontSize: '16px',
};

const itemsSection = {
  padding: '0 24px',
};

const itemText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#2d2d2d',
  margin: '0 0 8px',
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

export default ShippingConfirmationEmail;



