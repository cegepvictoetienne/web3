import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mon application Next.js",
  description: "Ma première application Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
