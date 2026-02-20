import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI HCP Field Force",
  description: "AI-powered pharma field force for engaging Healthcare Professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-surface-bg text-gray-100">{children}</body>
    </html>
  );
}
