/**
 * Not Found Page
 * 404 error page
 */

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-lg w-full">
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-6">😴🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link href="/">
            <Button>Return to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
