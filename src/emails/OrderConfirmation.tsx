import {
  Section,
  Row,
  Column,
  Text,
  Img,
  Link,
  Hr,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, EmailFooterSignature, emailStyles } from './shared/EmailLayout';
import { emailAssetSrc, getEmailSiteUrl } from './shared/emailSiteUrl';

interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  variantId?: string | null;
  variantName?: string | null;
  quantity: number;
  price: number;
}

interface OrderConfirmationEmailProps {
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
  siteUrl?: string;
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  customerEmail,
  items,
  subtotal,
  tax,
  shipping,
  total,
  shippingAddress,
  siteUrl = 'https://creativitybylilyco.com',
}: OrderConfirmationEmailProps) => {
  const shopUrl = getEmailSiteUrl(siteUrl);
  return (
    <EmailLayout siteUrl={siteUrl}>
      <Section style={emailStyles.content}>
        <Text style={emailStyles.heading}>Thank you for your order!</Text>
        <Text style={emailStyles.paragraph}>Hi {customerName},</Text>
        <Text style={emailStyles.paragraph}>
          We're thrilled that you've chosen creativity by lily! Your order has been received and is being prepared with care.
        </Text>
        <Text style={emailStyles.paragraph}>
          <strong>Order Number:</strong> {orderNumber}
        </Text>
      </Section>

      <Section style={{ padding: '0 24px' }}>
        <Text style={emailStyles.sectionHeading}>Order Details</Text>
        {items.map((item, index) => (
          <Section key={index} style={itemRow}>
            <Row>
              <Column style={itemImageColumn}>
                <Img
                  src={emailAssetSrc(siteUrl, item.productImage)}
                  width={100}
                  height={100}
                  alt={item.productTitle}
                  style={itemImage}
                />
              </Column>
              <Column style={itemDetailsColumn}>
                <Text style={itemTitle}>{item.productTitle}</Text>
                {item.variantName && <Text style={itemVariant}>Variant: {item.variantName}</Text>}
                <Text style={itemQuantity}>Quantity: {item.quantity}</Text>
                <Text style={itemPrice}>${item.price.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>
        ))}
      </Section>

      <Hr style={emailStyles.divider} />

      <Section style={{ padding: '0 24px' }}>
        <Row>
          <Column><Text style={summaryLabel}>Subtotal:</Text></Column>
          <Column align="right"><Text style={summaryValue}>${subtotal.toFixed(2)}</Text></Column>
        </Row>
        {tax > 0 && (
          <Row>
            <Column><Text style={summaryLabel}>Tax:</Text></Column>
            <Column align="right"><Text style={summaryValue}>${tax.toFixed(2)}</Text></Column>
          </Row>
        )}
        {shipping > 0 && (
          <Row>
            <Column><Text style={summaryLabel}>Shipping:</Text></Column>
            <Column align="right"><Text style={summaryValue}>${shipping.toFixed(2)}</Text></Column>
          </Row>
        )}
        <Row style={emailStyles.totalRow}>
          <Column><Text style={emailStyles.totalLabel}>Total:</Text></Column>
          <Column align="right"><Text style={emailStyles.totalValue}>${total.toFixed(2)}</Text></Column>
        </Row>
      </Section>

      <Section style={emailStyles.addressBox}>
        <Text style={emailStyles.sectionHeading}>Shipping Address</Text>
        <Text style={addressText}>
          {shippingAddress.firstName} {shippingAddress.lastName}
          <br />
          {shippingAddress.address}
          {shippingAddress.address2 && <><br />{shippingAddress.address2}</>}
          <br />
          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
          <br />
          {shippingAddress.country}
        </Text>
      </Section>

      <Section style={emailStyles.footer}>
        <Text style={emailStyles.footerText}>We'll send you a shipping confirmation email once your order is on its way!</Text>
        <Text style={emailStyles.footerText}>
          <Link href={shopUrl} style={emailStyles.footerLink}>Visit our website</Link>
        </Text>
        <EmailFooterSignature />
      </Section>
    </EmailLayout>
  );
};

const itemRow = { marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f0f0f0' };
const itemImageColumn = { width: 100, verticalAlign: 'top' as const };
const itemImage = { borderRadius: '8px', objectFit: 'cover' as const };
const itemDetailsColumn = { paddingLeft: '16px', verticalAlign: 'top' as const };
const itemTitle = { fontSize: '16px', fontWeight: 600, color: '#2d2d2d', margin: '0 0 4px' };
const itemVariant = { fontSize: '14px', color: '#666', margin: '0 0 4px' };
const itemQuantity = { fontSize: '14px', color: '#666', margin: '0 0 4px' };
const itemPrice = { fontSize: '16px', fontWeight: 600, color: '#ff72a6', margin: '8px 0 0' };
const summaryLabel = { fontSize: '16px', color: '#666', margin: '0' };
const summaryValue = { fontSize: '16px', color: '#2d2d2d', margin: '0', textAlign: 'right' as const };
const addressText = { fontSize: '16px', lineHeight: '24px', color: '#2d2d2d', margin: '0' };

export default OrderConfirmationEmail;
