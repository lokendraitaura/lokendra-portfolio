import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./studio.css";
import { SITE_URL, profile } from "@/data/profile";
import { jsonLd, KEYWORDS, SEO_DESCRIPTION, SEO_TITLE, SITE_NAME } from "@/data/seo";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ScrollProgress from "@/components/layout/ScrollProgress";
import MotionPreferences from "@/components/layout/MotionPreferences";
import FloatingActions from "@/components/layout/FloatingActions";
import SpotlightTracker from "@/components/layout/SpotlightTracker";
import AuroraBackground from "@/components/layout/AuroraBackground";
import ThemeCustomizer from "@/components/layout/ThemeCustomizer";
import { themeBootScript } from "@/data/themes";

const inter = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Sora({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SEO_TITLE, template: "%s | Lokendra Kumar Prajapati" },
  description: SEO_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: profile.fullName, url: SITE_URL }],
  creator: profile.fullName,
  publisher: profile.fullName,
  keywords: KEYWORDS,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    locale: "en_IN",
    firstName: "Lokendra",
    lastName: "Prajapati",
    username: "lokendraitaura",
    gender: "male",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  formatDetection: { telephone: true, email: true },
  other: { "profile:username": "lokendraitaura" },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable} ${jetbrains.variable} antialiased`}>
      <head>
        {/* Applies the visitor's saved theme before first paint (no colour flash). */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen">
        <a href="#main" className="skip-link">Skip to content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <MotionPreferences>
        <AuroraBackground />
        <SmoothScroll />
        <ScrollProgress />
        <SpotlightTracker />
        {children}
        <FloatingActions />
        <ThemeCustomizer />
        </MotionPreferences>
      </body>
    </html>
  );
}
