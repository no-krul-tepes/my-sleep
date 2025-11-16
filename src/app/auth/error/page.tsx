/**
 * Auth Error Page
 * Displays authentication errors
 */

'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const errorMessages: Record<string, string> = {
  Configuration: 'Ошибка конфигурации сервера. Проверьте переменные окружения.',
  AccessDenied: 'Доступ запрещён.',
  Verification: 'Ссылка для проверки истекла или уже была использована.',
  Default: 'Произошла ошибка при входе в систему.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-indigo-50/30 to-white">
      <Card className="max-w-md w-full">
        <CardContent className="text-center py-12 px-6">
          {/* Error Icon */}
          <div className="text-6xl mb-6">⚠️</div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ошибка входа
          </h1>

          {/* Error message */}
          <p className="text-gray-600 mb-8">
            {errorMessage}
          </p>

          {/* Error code */}
          <div className="bg-gray-100 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600">Код ошибки:</p>
            <p className="text-lg font-mono text-gray-900">{error}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/auth/signin">
              <Button className="w-full">
                Попробовать снова
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                На главную
              </Button>
            </Link>
          </div>

          {/* Help text */}
          {error === 'Configuration' && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
              <p className="text-sm text-yellow-800">
                <strong>Для администратора:</strong>
              </p>
              <ul className="text-xs text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                <li>Проверьте наличие AUTH_SECRET</li>
                <li>Проверьте GITHUB_CLIENT_ID и GITHUB_CLIENT_SECRET</li>
                <li>Убедитесь, что NEXTAUTH_URL установлен правильно</li>
                <li>Проверьте callback URL в настройках GitHub OAuth</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-4xl mb-4">💤</div>
            <p className="text-gray-600">Загрузка...</p>
          </div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
