import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/shared/lib/utils";

export const metadata: Metadata = {
  title: "PocketNote - Kinetic Precision Command Center",
  description:
    "Graceful personal finance tracker designed with modern minimalism.",
};

import type { Viewport } from "next";

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
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        GeistSans.variable,
        GeistMono.variable,
      )}
    >
      <body className="bg-background min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
