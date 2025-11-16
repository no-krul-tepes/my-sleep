/**
 * Dashboard Page
 * Main page with sleep logs and create form
 */

'use client';

import { useState } from 'react';
import { SleepEntryForm } from '@/components/sleep/SleepEntryForm';
import { SleepLogList } from '@/components/sleep/SleepLogList';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSleepLogs } from '@/hooks/useSleepLogs';
import { useSleepForm } from '@/hooks/useSleepForm';
import type { SleepLog, CreateSleepLogDTO } from '@/lib/types';

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<SleepLog | null>(null);

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
    if (window.confirm('Are you sure you want to delete this sleep log?')) {
      await deleteSleepLog(id);
      refetch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sleep Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track and analyze your sleep patterns
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          ✨ New Sleep Log
        </Button>
      </div>

      {/* Quick Stats */}
      {logs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card variant="elevated">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-indigo-600">
                {logs.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Total Logs
              </div>
            </div>
          </Card>
          <Card variant="elevated">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(
                  logs.reduce((sum, log) => sum + log.durationMinutes, 0) /
                    logs.length /
                    60
                )}h
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Avg Duration
              </div>
            </div>
          </Card>
          <Card variant="elevated">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-green-600">
                {logs.filter((log) => log.qualityRating && log.qualityRating >= 7)
                  .length}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Good Nights
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
        title="Create Sleep Log"
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
        title="Edit Sleep Log"
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
