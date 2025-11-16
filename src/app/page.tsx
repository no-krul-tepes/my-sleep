/**
 * Dashboard Page
 * Main page with sleep logs and create form
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SleepEntryForm } from '@/components/sleep/SleepEntryForm';
import { SleepLogList } from '@/components/sleep/SleepLogList';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSleepLogs } from '@/hooks/useSleepLogs';
import { useSleepForm } from '@/hooks/useSleepForm';
import type { SleepLog, CreateSleepLogDTO } from '@/lib/types';

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<SleepLog | null>(null);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const { logs, isLoading, refetch } = useSleepLogs({ limit: 50 });
  const { createSleepLog, updateSleepLog, deleteSleepLog, isSubmitting } =
    useSleepForm({
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setEditingLog(null);
        refetch();
      },
    });

  const handleCreate = async (data: CreateSleepLogDTO) => {
    await createSleepLog(data);
  };

  const handleEdit = (log: SleepLog) => {
    setEditingLog(log);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: CreateSleepLogDTO) => {
    if (!editingLog) return;
    await updateSleepLog(editingLog.id, data);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись о сне?')) {
      await deleteSleepLog(id);
      refetch();
    }
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">💤</div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirecting)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Мой сон
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Отслеживайте и анализируйте свои паттерны сна
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <span className="mr-2">➕</span>
          Добавить запись
        </Button>
      </div>

      {/* Quick Stats */}
      {logs.length > 0 && (
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
          <Card variant="elevated">
            <div className="text-center py-3 md:py-4">
              <div className="text-xl md:text-3xl font-bold text-indigo-600">
                {logs.length}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
                Записей
              </div>
            </div>
          </Card>
          <Card variant="elevated">
            <div className="text-center py-3 md:py-4">
              <div className="text-xl md:text-3xl font-bold text-purple-600">
                {Math.round(
                  logs.reduce((sum, log) => sum + log.durationMinutes, 0) /
                    logs.length /
                    60
                )}ч
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
                Средняя длит.
              </div>
            </div>
          </Card>
          <Card variant="elevated">
            <div className="text-center py-3 md:py-4">
              <div className="text-xl md:text-3xl font-bold text-green-600">
                {logs.filter((log) => log.qualityRating && log.qualityRating >= 7)
                  .length}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
                Хороших ночей
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Sleep Logs */}
      <Card>
        <SleepLogList
          logs={logs}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Добавить запись о сне"
        size="lg"
      >
        <SleepEntryForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLog(null);
        }}
        title="Редактировать запись"
        size="lg"
      >
        {editingLog && (
          <SleepEntryForm
            initialData={editingLog}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingLog(null);
            }}
            isLoading={isSubmitting}
          />
        )}
      </Modal>
    </div>
  );
}
