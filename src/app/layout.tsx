import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { FirebaseAuthProvider } from '@/providers/FirebaseAuthProvider';
import { Toaster } from "@/components/ui/toaster"; // Shadcn Toaster

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SolarView - Monitor Your Solar Power',
  description: 'Real-time solar panel metrics and historical data visualization.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <FirebaseAuthProvider>
          {children}
        </FirebaseAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
