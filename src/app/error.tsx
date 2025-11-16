/**
 * Error Boundary
 * Global error handler for the application
 */

'use client';

import { useEffect } from 'react';
import { Button } from '../../../../Downloads/sleep-app-complete/sleep-app/src/components/ui/Button';
import { Card, CardContent } from '../../../../Downloads/sleep-app-complete/sleep-app/src/components/ui/Card';

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
          <div className="text-6xl mb-6">😴💥</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={reset}>Try Again</Button>
            <Button
              variant="ghost"
              onClick={() => (window.location.href = '/')}
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
