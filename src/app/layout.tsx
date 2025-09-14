import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import { AuthProvider } from '@/store/authProvider';
import { ToastProvider } from '@/components/ui/alerts';
import { VerificationBanner } from '@/components/shared';
import QueryProvider from '@/components/providers/QueryProvider';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRS App",
  description: "Your app description here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-32 sm:pb-28`}
      >
        <AuthProvider>
          <QueryProvider>
            <ToastProvider>
              <LanguageSelector />
              {children}
              <VerificationBanner />
            </ToastProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
