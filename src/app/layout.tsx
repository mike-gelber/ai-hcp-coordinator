import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patent Buddy — Check If Your Idea Is Patentable",
  description:
    "Patent Buddy helps inventors and entrepreneurs get a preliminary patentability assessment for their ideas. Understand novelty, non-obviousness, and utility — and learn your next steps.",
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
