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

const SITE_URL = "https://bluesky.travel";
const SITE_NAME = "BlueSky Travel";
const SITE_DESCRIPTION =
  "Discover the world with BlueSky Travel — premium trips, luxury hotels, flights and visa services for Egypt and the world.";
const OG_IMAGE = "https://picsum.photos/seed/bluesky-travel-og/1200/630";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BlueSky Travel — Premium Trips, Hotels, Flights & Visa Services",
    template: "%s · BlueSky Travel",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "BlueSky Travel",
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
  authors: [{ name: "BlueSky Travel Team" }],
  creator: "BlueSky Travel",
  publisher: "BlueSky Travel",
  applicationName: "BlueSky Travel",
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
    title: "BlueSky Travel — Premium Trips, Hotels & Flights",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "BlueSky Travel — Discover the world",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlueSky Travel — Premium Trips, Hotels & Flights",
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
  name: "BlueSky Travel",
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
