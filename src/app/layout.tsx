'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { siteConfig } from "./config";

const inter = Inter({ subsets: ["latin"] });

async function generateMetadata() {
  return {
    title: siteConfig.title,
    description: siteConfig.description,
  };
}

export { generateMetadata as metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
