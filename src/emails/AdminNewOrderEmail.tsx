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
import { EmailLayout, emailStyles } from './shared/EmailLayout';

interface AdminOrderItem {
  productTitle: string;
  productImage: string;
  quantity: number;
  price: number;
  variantName?: string | null;
}

export interface AdminNewOrderEmailProps {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  items: AdminOrderItem[];
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
  paymentId?: string | null;
  siteUrl?: string;
}

export const AdminNewOrderEmail = ({
  orderId,
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  items,
  subtotal,
  tax,
  shipping,
  total,
  shippingAddress,
  paymentId,
  siteUrl = 'https://creativitybylilyco.com',
}: AdminNewOrderEmailProps) => {
  const baseUrl = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
  const adminOrderUrl = `${baseUrl}/admin/orders/${orderId}`;

  return (
    <EmailLayout siteUrl={siteUrl}>
      <Section style={emailStyles.content}>
        <Text style={emailStyles.heading}>New order on your website</Text>
        <Text style={emailStyles.paragraph}>
          Someone just completed checkout. Order details are below.
        </Text>
        <Text style={emailStyles.paragraph}>
          <strong>Order number:</strong> {orderNumber}
        </Text>
        <Text style={emailStyles.paragraph}>
          <Link href={adminOrderUrl} style={emailStyles.footerLink}>
            View order in admin →
          </Link>
        </Text>
      </Section>

      <Section style={{ padding: '0 24px 8px' }}>
        <Text style={emailStyles.sectionHeading}>Customer</Text>
        <Text style={detailText}>
          <strong>Name:</strong> {customerName}
          <br />
          <strong>Email:</strong> {customerEmail}
          {customerPhone ? (
            <>
              <br />
              <strong>Phone:</strong> {customerPhone}
            </>
          ) : null}
        </Text>
      </Section>

      <Section style={emailStyles.addressBox}>
        <Text style={emailStyles.sectionHeading}>Shipping address</Text>
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

      <Section style={{ padding: '0 24px' }}>
        <Text style={emailStyles.sectionHeading}>Line items</Text>
        {items.map((item, index) => (
          <Section key={index} style={itemRow}>
            <Row>
              <Column style={itemImageColumn}>
                <Img
                  src={item.productImage.startsWith('http') ? item.productImage : `${baseUrl}${item.productImage}`}
                  width={72}
                  height={72}
                  alt={item.productTitle}
                  style={itemImage}
                />
              </Column>
              <Column style={itemDetailsColumn}>
                <Text style={itemTitle}>{item.productTitle}</Text>
                {item.variantName ? (
                  <Text style={itemMeta}>Variant: {item.variantName}</Text>
                ) : null}
                <Text style={itemMeta}>Qty: {item.quantity}</Text>
                <Text style={itemPrice}>${item.price.toFixed(2)} each</Text>
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
          <Column><Text style={emailStyles.totalLabel}>Total</Text></Column>
          <Column align="right"><Text style={emailStyles.totalValue}>${total.toFixed(2)}</Text></Column>
        </Row>
        {paymentId && (
          <Text style={{ ...detailText, marginTop: '16px' }}>
            <strong>Payment ID (Square):</strong> {paymentId}
          </Text>
        )}
      </Section>

      <Section style={emailStyles.footer}>
        <Text style={emailStyles.footerText}>
          Automated message from creativity by lily — reply to this email only if your inbox supports it;
          customer replies go to the address on the order.
        </Text>
        <Text style={emailStyles.footerText}>
          <Link href={adminOrderUrl} style={emailStyles.footerLink}>
            Open order in admin
          </Link>
        </Text>
      </Section>
    </EmailLayout>
  );
};

const detailText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#2d2d2d',
  margin: '0',
};

const addressText = { ...detailText };

const itemRow = { marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' };
const itemImageColumn = { width: 72, verticalAlign: 'top' as const };
const itemImage = { borderRadius: '8px', objectFit: 'cover' as const };
const itemDetailsColumn = { paddingLeft: '12px', verticalAlign: 'top' as const };
const itemTitle = { fontSize: '15px', fontWeight: 600, color: '#2d2d2d', margin: '0 0 4px' };
const itemMeta = { fontSize: '14px', color: '#666', margin: '0 0 4px' };
const itemPrice = { fontSize: '14px', fontWeight: 600, color: '#ff72a6', margin: '6px 0 0' };
const summaryLabel = { fontSize: '15px', color: '#666', margin: '0' };
const summaryValue = { fontSize: '15px', color: '#2d2d2d', margin: '0', textAlign: 'right' as const };

export default AdminNewOrderEmail;
