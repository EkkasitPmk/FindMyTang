import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "FindMyTang - Smart Personal Asset Tracker & Command Center",
  description:
    "Graceful personal finance tracker designed with modern minimalism.",
  openGraph: {
    title: "FindMyTang - Smart Personal Asset Tracker & Command Center",
    description:
      "Graceful personal finance tracker designed with modern minimalism.",
    siteName: "FindMyTang",
    locale: "th_TH",
    alternateLocale: ["en_US"],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
