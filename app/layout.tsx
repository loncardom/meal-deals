import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Erin Mills Deals — Deals Today",
  description: "Useful restaurant deals near Erin Mills Town Centre, with source confidence shown clearly.",
  openGraph: {
    title: "Erin Mills Deals",
    description: "Useful food deals near the mall — checked daily",
    images: ["https://loncardom.github.io/meal-deals/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Erin Mills Deals",
    description: "Useful food deals near the mall — checked daily",
    images: ["https://loncardom.github.io/meal-deals/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
