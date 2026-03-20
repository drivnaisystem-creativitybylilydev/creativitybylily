import { Section, Row, Column, Text, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, EmailFooterSignature, emailStyles } from './shared/EmailLayout';
import { getEmailSiteUrl } from './shared/emailSiteUrl';

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
  siteUrl = 'https://creativitybylilyco.com',
}: ReturnApprovedProps) => {
  const url = getEmailSiteUrl(siteUrl);
  return (
    <EmailLayout siteUrl={siteUrl}>
      <Section style={emailStyles.content}>
        <Text style={emailStyles.heading}>Return Approved! ✅</Text>
        <Text style={emailStyles.paragraph}>Hi {customerName},</Text>
        <Text style={emailStyles.paragraph}>
          Great news! Your return request <strong>{returnNumber}</strong> has been approved. Please ship the items back to us using the address below.
        </Text>
      </Section>

      <Section style={emailStyles.addressBox}>
        <Text style={emailStyles.sectionHeading}>Return Shipping Address</Text>
        <Text style={addressText}>
          {returnAddress.name && <>{returnAddress.name}<br /></>}
          {returnAddress.address}
          {returnAddress.address2 && <><br />{returnAddress.address2}</>}
          <br />
          {returnAddress.city}, {returnAddress.state} {returnAddress.zip}
          <br />
          {returnAddress.country}
        </Text>
      </Section>

      <Section style={{ padding: '0 24px' }}>
        <Text style={emailStyles.sectionHeading}>Return Instructions</Text>
        <Text style={emailStyles.paragraph}>
          1. Package the items securely<br />
          2. Ship to the address above (you'll pay for return shipping)<br />
          3. Add your tracking number in your account once shipped<br />
          4. We'll process your refund once we receive and inspect the items
        </Text>
      </Section>

      <Section style={{ padding: '0 24px' }}>
        <Row style={emailStyles.totalRow}>
          <Column><Text style={emailStyles.totalLabel}>Refund Amount:</Text></Column>
          <Column align="right"><Text style={emailStyles.totalValue}>${refundAmount.toFixed(2)}</Text></Column>
        </Row>
      </Section>

      <Section style={emailStyles.footer}>
        <Text style={emailStyles.footerText}>Once you've shipped your return, you can add the tracking number in your account to help us track your package.</Text>
        <Text style={emailStyles.footerText}>
          <Link href={`${url}/account`} style={emailStyles.footerLink}>View Return Status</Link>
        </Text>
        <EmailFooterSignature />
      </Section>
    </EmailLayout>
  );
};

const addressText = { fontSize: '16px', lineHeight: '24px', color: '#2d2d2d', margin: '0' };

export default ReturnApprovedEmail;
