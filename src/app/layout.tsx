import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI HCP Field Force — Drive Script Lift With AI-Powered HCP Engagement",
  description:
    "Transform your pharma field force with AI agents that deliver hyper-personalized HCP outreach, measurable script lift, and 4.2x campaign ROI.",
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
