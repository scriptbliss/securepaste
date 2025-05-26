import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import './globals.css';

import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['500', '700'],
});

export const metadata: Metadata = {
  title: 'SecurePaste',
  description: 'A secure paste app with password protection',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased scroll-smooth bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class" // Uses `class="dark"` on <html>
          defaultTheme="system" // Use system preference by default
          enableSystem={true} // Enable system theme detection
          disableTransitionOnChange // Prevents flickering
        >
          <Header />
          <main className="flex-1 overflow-auto box-border px-4 py-6">
            <div className="min-h-full h-auto flex flex-col items-center justify-center max-w-full">
              {children}
            </div>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
