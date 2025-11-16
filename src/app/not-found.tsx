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
          <div className="text-5xl md:text-6xl mb-6">😴🔍</div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Страница не найдена
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Страница, которую вы ищете, не существует или была перемещена.
          </p>
          <Link href="/">
            <Button className="w-full sm:w-auto">Вернуться на главную</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
