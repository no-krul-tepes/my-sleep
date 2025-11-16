/**
 * Error Boundary
 * Global error handler for the application
 */

'use client';


import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-lg w-full">
        <CardContent className="text-center py-12">
          <div className="text-5xl md:text-6xl mb-6">😴💥</div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Упс! Что-то пошло не так
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            {error.message || 'Произошла непредвиденная ошибка'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="w-full sm:w-auto">
              Попробовать снова
            </Button>
            <Button
              variant="ghost"
              onClick={() => (window.location.href = '/')}
              className="w-full sm:w-auto"
            >
              На главную
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
