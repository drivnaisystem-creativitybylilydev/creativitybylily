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
  Hr,
} from '@react-email/components';
import * as React from 'react';

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
  siteUrl = 'https://creativitybylily.com',
}: OrderConfirmationEmailProps) => {
  const logoPink = '#ff72a6';
  const softPink = '#f8e8e8';
  const warmBeige = '#f7f0e8';

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
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

          {/* Thank You Message */}
          <Section style={content}>
            <Text style={heading}>Thank you for your order!</Text>
            <Text style={paragraph}>
              Hi {customerName},
            </Text>
            <Text style={paragraph}>
              We're thrilled that you've chosen creativity by lily! Your order has been received and is being prepared with care.
            </Text>
            <Text style={paragraph}>
              <strong>Order Number:</strong> {orderNumber}
            </Text>
          </Section>

          {/* Order Items */}
          <Section style={itemsSection}>
            <Text style={sectionHeading}>Order Details</Text>
            {items.map((item, index) => (
              <Section key={index} style={itemRow}>
                <Row>
                  <Column style={itemImageColumn}>
                    <Img
                      src={item.productImage.startsWith('http') 
                        ? item.productImage 
                        : `${siteUrl}${item.productImage}`}
                      width="100"
                      height="100"
                      alt={item.productTitle}
                      style={itemImage}
                    />
                  </Column>
                  <Column style={itemDetailsColumn}>
                    <Text style={itemTitle}>{item.productTitle}</Text>
                    {item.variantName && (
                      <Text style={itemVariant}>Variant: {item.variantName}</Text>
                    )}
                    <Text style={itemQuantity}>Quantity: {item.quantity}</Text>
                    <Text style={itemPrice}>${item.price.toFixed(2)}</Text>
                  </Column>
                </Row>
              </Section>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Order Summary */}
          <Section style={summarySection}>
            <Row>
              <Column>
                <Text style={summaryLabel}>Subtotal:</Text>
              </Column>
              <Column align="right">
                <Text style={summaryValue}>${subtotal.toFixed(2)}</Text>
              </Column>
            </Row>
            {tax > 0 && (
              <Row>
                <Column>
                  <Text style={summaryLabel}>Tax:</Text>
                </Column>
                <Column align="right">
                  <Text style={summaryValue}>${tax.toFixed(2)}</Text>
                </Column>
              </Row>
            )}
            {shipping > 0 && (
              <Row>
                <Column>
                  <Text style={summaryLabel}>Shipping:</Text>
                </Column>
                <Column align="right">
                  <Text style={summaryValue}>${shipping.toFixed(2)}</Text>
                </Column>
              </Row>
            )}
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Total:</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>${total.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Shipping Address */}
          <Section style={addressSection}>
            <Text style={sectionHeading}>Shipping Address</Text>
            <Text style={addressText}>
              {shippingAddress.firstName} {shippingAddress.lastName}
              <br />
              {shippingAddress.address}
              {shippingAddress.address2 && (
                <>
                  <br />
                  {shippingAddress.address2}
                </>
              )}
              <br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
              <br />
              {shippingAddress.country}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              We'll send you a shipping confirmation email once your order is on its way!
            </Text>
            <Text style={footerText}>
              If you have any questions, feel free to reach out to us.
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

// Styles
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
  marginBottom: '24px',
  paddingBottom: '24px',
  borderBottom: '1px solid #f0f0f0',
};

const itemImageColumn = {
  width: '100px',
  verticalAlign: 'top',
};

const itemImage = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
};

const itemDetailsColumn = {
  paddingLeft: '16px',
  verticalAlign: 'top',
};

const itemTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2d2d2d',
  margin: '0 0 4px',
};

const itemVariant = {
  fontSize: '14px',
  color: '#666',
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

const divider = {
  borderColor: '#f0f0f0',
  margin: '24px 0',
};

const summarySection = {
  padding: '0 24px',
};

const summaryLabel = {
  fontSize: '16px',
  color: '#666',
  margin: '0',
};

const summaryValue = {
  fontSize: '16px',
  color: '#2d2d2d',
  margin: '0',
  textAlign: 'right' as const,
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

export default OrderConfirmationEmail;








