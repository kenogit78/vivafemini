import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VivaFemini — Menstrual Health Tracking',
  description:
    'Track your cycle, symptoms, and health insights with VivaFemini.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen bg-app-bg pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-8">
          <div className="mx-auto w-full min-w-0 max-w-6xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
