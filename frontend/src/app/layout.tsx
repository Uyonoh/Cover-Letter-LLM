import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoverLetterLLM",
  description: "The perfect coverletter for your job.",
  verification: {
    google: "bhWG9i5XMs9d5VWJGKKwwu9HTmONOATeH0b_-U9FXqI"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased relative w-full min-h-screen`}
        >
        <Header />
        {children}
      </body>
    </html>
  );
}
