import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinguaAgents - AI Language Learning",
  description:
    "Multi-agent AI language learning platform for English, Spanish, and German",
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
