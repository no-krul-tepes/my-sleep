/**
 * Root Layout
 * Main application layout with metadata
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Дневник Сна - Отслеживайте качество своего сна',
  description: 'Современное приложение для отслеживания и улучшения качества вашего сна',
  keywords: ['сон', 'отслеживание', 'здоровье', 'самочувствие', 'качество сна'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50/30 to-white">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-4 md:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs md:text-sm text-gray-600">
              © 2025 Дневник Сна. Создано с Next.js 16 & PostgreSQL
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
