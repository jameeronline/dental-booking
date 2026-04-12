import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AZ Hospital - Dental Care & Appointment Booking",
  description: "Book your dental appointment online at AZ Hospital. Professional dental care with experienced dentists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} ${inter.variable} antialiased min-h-screen bg-background font-sans`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
