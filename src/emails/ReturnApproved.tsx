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

interface ReturnApprovedProps {
  returnNumber: string;
  customerName: string;
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
  siteUrl?: string;
}

export const ReturnApprovedEmail = ({
  returnNumber,
  customerName,
  returnAddress,
  refundAmount,
  siteUrl = 'https://creativitybylily.com',
}: ReturnApprovedProps) => {
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
            <Text style={heading}>Return Approved! ✅</Text>
            <Text style={paragraph}>
              Hi {customerName},
            </Text>
            <Text style={paragraph}>
              Great news! Your return request <strong>{returnNumber}</strong> has been approved. Please ship the items back to us using the address below.
            </Text>
          </Section>

          {/* Return Address */}
          <Section style={addressSection}>
            <Text style={sectionHeading}>Return Shipping Address</Text>
            <Text style={addressText}>
              {returnAddress.name && (
                <>
                  {returnAddress.name}
                  <br />
                </>
              )}
              {returnAddress.address}
              {returnAddress.address2 && (
                <>
                  <br />
                  {returnAddress.address2}
                </>
              )}
              <br />
              {returnAddress.city}, {returnAddress.state} {returnAddress.zip}
              <br />
              {returnAddress.country}
            </Text>
          </Section>

          {/* Instructions */}
          <Section style={instructionsSection}>
            <Text style={sectionHeading}>Return Instructions</Text>
            <Text style={paragraph}>
              1. Package the items securely<br />
              2. Ship to the address above (you'll pay for return shipping)<br />
              3. Add your tracking number in your account once shipped<br />
              4. We'll process your refund once we receive and inspect the items
            </Text>
          </Section>

          {/* Refund Amount */}
          <Section style={summarySection}>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Refund Amount:</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>${refundAmount.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Once you've shipped your return, you can add the tracking number in your account to help us track your package.
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

const addressSection = {
  padding: '24px',
  backgroundColor: '#f7f0e8',
  borderRadius: '8px',
  margin: '24px',
};

const addressText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#2d2d2d',
  margin: '0',
};

const instructionsSection = {
  padding: '0 24px',
};

const sectionHeading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#2d2d2d',
  margin: '0 0 20px',
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

export default ReturnApprovedEmail;
