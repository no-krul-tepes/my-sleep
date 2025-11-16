/**
 * Settings Page
 * Application settings and preferences
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">⚙️ Настройки</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Управление параметрами приложения
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>ℹ️ О приложении</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5 text-xs md:text-sm text-gray-600">
              <div className="flex justify-between items-center py-1">
                <span className="font-medium">Версия:</span>
                <span className="font-mono">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium">Фреймворк:</span>
                <span>Next.js 16</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium">База данных:</span>
                <span>PostgreSQL</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium">Runtime:</span>
                <span>Bun</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Goals */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Цели сна</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 text-sm md:text-base">
                  Целевая продолжительность сна
                </h4>
                <p className="text-xs md:text-sm text-gray-600 mb-4">
                  Установите желаемую продолжительность сна (обычно 7-9 часов).
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="4"
                    max="12"
                    defaultValue="8"
                    className="px-3 py-2 border border-gray-300 rounded-lg w-16 md:w-20 text-center font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="text-sm md:text-base text-gray-600">часов</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
