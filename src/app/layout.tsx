import type { Metadata } from "next";
import { Playfair_Display, Inter, Dancing_Script } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import CartIcon from "@/components/CartIcon";
import SearchBar from "@/components/SearchBar";

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
        <CartProvider>
          <header className="sticky top-0 z-50 border-b border-pink-200" style={{ backgroundColor: 'var(--soft-pink)' }}>
            <div className="mx-auto max-w-7xl px-6 py-3 md:py-4 flex items-center">
              <a href="/" className="flex items-center gap-3">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-full overflow-hidden bg-white/70 ring-1 ring-pink-200">
                  <Image 
                    src="/brand_logo.webp" 
                    alt="Creativity by Lily" 
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <span className={`${script.className} text-[color:var(--logo-pink)] text-xl md:text-2xl leading-none`}>
                  creativity by lily
                </span>
              </a>
              <nav className="hidden md:flex items-center gap-8 text-lg font-serif ml-64 mr-4">
                <a href="/" className="text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity">Home</a>
                <a href="/products" className="text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity">Shop</a>
                <a href="/events" className="text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity">Events</a>
                <a href="#about" className="text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity">About</a>
                <a href="#contact" className="text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity">Contact</a>
              </nav>
              <div className="flex items-center gap-4 ml-auto">
                <SearchBar />
                <a href="https://www.instagram.com/creativitybylily.co/" target="_blank" rel="noopener noreferrer" className="text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <CartIcon />
              </div>
            </div>
          </header>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
