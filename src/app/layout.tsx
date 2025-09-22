import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/store/authProvider';
import { ToastProvider } from '@/components/ui/alerts';
import { VerificationBanner } from '@/components/shared';
import QueryProvider from '@/components/providers/QueryProvider';
import { NotificationProvider } from '@/store/notificationProvider';
 


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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            <NotificationProvider>
              <ToastProvider>
                {children}
                <VerificationBanner />
              </ToastProvider>
            </NotificationProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
