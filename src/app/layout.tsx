import type { Metadata } from "next";
import { Playfair_Display, Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthErrorHandler from "@/components/AuthErrorHandler";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const script = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://creativitybylily.com'),
  title: {
    default: "creativity by lily - Handcrafted Jewelry from Cape Cod",
    template: "%s | creativity by lily",
  },
  description: "Contemporary, minimal handcrafted jewelry from Cape Cod. Discover our collection of unique pieces designed to bring coastal elegance to your style.",
  keywords: ["jewelry", "handcrafted", "Cape Cod", "contemporary", "minimal", "unique", "coastal", "elegance"],
  authors: [{ name: "Lily" }],
  creator: "creativity by lily",
  publisher: "creativity by lily",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "creativity by lily - Handcrafted Jewelry from Cape Cod",
    description: "Contemporary, minimal handcrafted jewelry from Cape Cod. Discover our collection of unique pieces designed to bring coastal elegance to your style.",
    url: "https://creativitybylily.com",
    siteName: "creativity by lily",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "creativity by lily - Handcrafted Jewelry",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "creativity by lily - Handcrafted Jewelry from Cape Cod",
    description: "Contemporary, minimal handcrafted jewelry from Cape Cod. Discover our collection of unique pieces designed to bring coastal elegance to your style.",
    images: ["/og.png"],
    creator: "@creativitybylily",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "creativity by lily",
              "description": "Contemporary, minimal handcrafted jewelry from Cape Cod",
              "url": "https://creativitybylily.com",
              "logo": "https://creativitybylily.com/brand_logo.webp",
              "sameAs": [
                "https://instagram.com/creativitybylily"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "areaServed": "US",
                "availableLanguage": "English"
              }
            })
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} ${script.variable} antialiased`}
      >
        <AuthErrorHandler />
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
