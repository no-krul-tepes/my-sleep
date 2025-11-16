/**
 * Header Component
 * Main application header
 */

'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">💤</span>
              <h1 className="text-xl font-bold text-gray-900">
                Sleep Logger
              </h1>
            </Link>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/stats"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              Statistics
            </Link>
            <Link
              href="/settings"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
