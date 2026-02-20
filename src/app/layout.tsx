import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Impiricus - Virtual Coordinator",
  description: "AI-powered pharma field force for engaging Healthcare Professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-surface-base text-gray-100">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-[220px] min-h-screen">{children}</div>
        </div>
      </body>
    </html>
  );
}
