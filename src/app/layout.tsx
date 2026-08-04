import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const interMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://boundless.travel";
const SITE_NAME = "BOUNDLESS";
const SITE_DESCRIPTION =
  "Discover the world with BOUNDLESS — your travel guide for premium trips, luxury hotels, flights and visa services.";
const OG_IMAGE = "https://picsum.photos/seed/boundless-og/1200/630";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BOUNDLESS — Your Travel Guide | Premium Trips, Hotels, Flights & Visa Services",
    template: "%s · BOUNDLESS",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "BOUNDLESS",
    "Egypt tours",
    "Egypt trips",
    "Maldives honeymoon",
    "Cappadocia balloons",
    "Santorini holidays",
    "luxury hotels",
    "cheap flights",
    "visa services",
    "Nile cruise",
    "Red Sea diving",
    "Maasai Mara safari",
  ],
  authors: [{ name: "Boundless Team" }],
  creator: "BOUNDLESS",
  publisher: "BOUNDLESS",
  applicationName: "BOUNDLESS",
  category: "Travel & Tourism",
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: SITE_URL,
      ar: `${SITE_URL}/ar`,
      fr: `${SITE_URL}/fr`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "BOUNDLESS — Your Travel Guide",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "BOUNDLESS — Discover the world",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BOUNDLESS — Your Travel Guide",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@blueskytravel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6FAFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "BOUNDLESS",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  image: OG_IMAGE,
  email: "hello@bluesky.travel",
  telephone: "+20-22-123-4567",
  priceRange: "$$-$$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "14 Tahrir Square",
    addressLocality: "Cairo",
    addressRegion: "Cairo Governorate",
    postalCode: "11511",
    addressCountry: "EG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 30.0444,
    longitude: 31.2357,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  sameAs: [
    "https://facebook.com/blueskytravel",
    "https://twitter.com/blueskytravel",
    "https://instagram.com/bluesky.travel",
    "https://linkedin.com/company/blueskytravel",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "48250",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Fixed navbar offset — ensures section titles aren't hidden behind the
            ~80px tall fixed header when navigating via navbar links or hash URLs.
            Must be in <head> (not globals.css) because Tailwind v4 strips plain
            CSS rules from @layer base. */}
        <style dangerouslySetInnerHTML={{
          __html: `section[id] { scroll-margin-top: 5rem; }`,
        }} />
      </head>
      <body
        className={`${inter.variable} ${interMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <Sonner position="top-right" />
      </body>
    </html>
  );
}
