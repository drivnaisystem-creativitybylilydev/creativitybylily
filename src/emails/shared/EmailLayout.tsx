import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Link,
} from '@react-email/components';
import * as React from 'react';
import { getEmailSiteUrl, getDeploymentBaseUrl } from './emailSiteUrl';

const BRAND_LOGO_PINK = '#ff72a6';
const SOFT_PINK = '#f8e8e8';
const WARM_BEIGE = '#f7f0e8';

export const emailStyles = {
  main: {
    backgroundColor: '#fefcf9',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '600px',
  },
  header: {
    backgroundColor: SOFT_PINK,
    padding: '28px 24px',
    textAlign: 'center' as const,
  },
  logo: {
    borderRadius: '50%',
    margin: '0 auto 12px',
    display: 'block',
  },
  brandName: {
    fontSize: '28px',
    fontWeight: '700',
    color: BRAND_LOGO_PINK,
    margin: '0',
    fontFamily: '"Dancing Script", cursive',
    lineHeight: '1.2',
  },
  content: {
    padding: '32px 24px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2d2d2d',
    margin: '0 0 16px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#2d2d2d',
    margin: '0 0 16px',
  },
  sectionHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2d2d2d',
    margin: '0 0 20px',
  },
  footer: {
    padding: '32px 24px',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#666',
    margin: '0 0 12px',
  },
  footerLink: {
    color: BRAND_LOGO_PINK,
    textDecoration: 'underline',
  },
  footerSignature: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#2d2d2d',
    margin: '24px 0 0',
    fontStyle: 'italic',
  },
  divider: {
    borderColor: '#f0f0f0',
    margin: '24px 0',
  },
  addressBox: {
    padding: '24px',
    backgroundColor: WARM_BEIGE,
    borderRadius: '8px',
    margin: '24px',
  },
  totalRow: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `2px solid ${BRAND_LOGO_PINK}`,
  },
  totalLabel: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d2d2d',
    margin: '0',
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: BRAND_LOGO_PINK,
    margin: '0',
    textAlign: 'right' as const,
  },
} as const;

export interface EmailLayoutProps {
  siteUrl?: string;
  children: React.ReactNode;
}

export function EmailHeader({ siteUrl = getDeploymentBaseUrl() }: { siteUrl?: string }) {
  // Hosted logo from the live site (WebP) so Gmail / Apple Mail load it reliably; localhost is never used.
  const publicBase = getEmailSiteUrl(siteUrl);
  const logoSrc = `${publicBase}/brand_logo.webp`;
  return (
    <Section style={emailStyles.header}>
      <Img
        src={logoSrc}
        width={64}
        height={64}
        alt="creativity by lily"
        style={{ ...emailStyles.logo, display: 'block', border: 0 }}
      />
      <Text style={emailStyles.brandName}>creativity by lily</Text>
    </Section>
  );
}

export function EmailFooterSignature() {
  return (
    <Text style={emailStyles.footerSignature}>
      With love from Cape Cod,
      <br />
      <span style={{ fontFamily: '"Dancing Script", cursive' }}>creativity by lily</span>
    </Text>
  );
}

export function EmailLayout({ siteUrl = getDeploymentBaseUrl(), children }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <EmailHeader siteUrl={siteUrl} />
          {children}
        </Container>
      </Body>
    </Html>
  );
}

export { getDeploymentBaseUrl };
