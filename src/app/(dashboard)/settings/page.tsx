/**
 * Settings Page
 * Application settings and preferences
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your application preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Framework:</span>
                <span>Next.js 16</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Database:</span>
                <span>PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Runtime:</span>
                <span>Bun</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Sleep Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Target Sleep Duration
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Set your ideal sleep duration (typically 7-9 hours).
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="4"
                    max="12"
                    defaultValue="8"
                    className="px-3 py-2 border border-gray-300 rounded-lg w-20"
                  />
                  <span className="text-sm text-gray-600">hours</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
