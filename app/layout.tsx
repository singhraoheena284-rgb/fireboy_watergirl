import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fire & Water",
  description: "A cooperative two-character puzzle platformer"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
