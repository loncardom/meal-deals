import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    title: "Erin Mills Deals — Deals Today",
    description: "Useful restaurant deals near Erin Mills Town Centre, with source confidence shown clearly.",
    openGraph: { title: "Erin Mills Deals", description: "Useful food deals near the mall — checked daily", images: [`${origin}/og.png`] },
    twitter: { card: "summary_large_image", title: "Erin Mills Deals", description: "Useful food deals near the mall — checked daily", images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
