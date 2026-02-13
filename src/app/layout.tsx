import type { Metadata } from "next";
import DemoBanner from "@/components/DemoBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI HCP Field Force",
  description:
    "AI-powered pharma field force for engaging Healthcare Professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
