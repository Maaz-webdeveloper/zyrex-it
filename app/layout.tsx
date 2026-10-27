import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const garet = localFont({
  src: [
    { path: "./fonts/Garet-Book.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Garet-Heavy.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-garet",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZyrexIT",
  description: "ZyrexIT Landing Page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={garet.variable}>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html> 
  );
}