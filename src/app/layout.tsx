/**
 * Root Layout
 * Main application layout with metadata
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '../../../../Downloads/sleep-app-complete/sleep-app/src/components/layout/Header';
import '../../../../Downloads/sleep-app-complete/sleep-app/src/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sleep Logger - Track Your Sleep Quality',
  description: 'Modern sleep tracking application to monitor and improve your sleep quality',
  keywords: ['sleep', 'tracking', 'health', 'wellness', 'sleep quality'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
              © 2025 Sleep Logger. Built with Next.js 16 & PostgreSQL.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
