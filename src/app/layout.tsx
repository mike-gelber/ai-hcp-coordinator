import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Impiricus – Ascend",
  description: "Virtual Coordinator dashboard for Impiricus Ascend platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
