/**
 * SleepEntryForm Component
 * Create/Edit sleep log form with validation
 */

'use client';

import { useState, FormEvent } from 'react';
import { format } from 'date-fns';
import { Input } from '../ui/Input';
import { DateInput } from '../ui/DateInput';
import { Slider } from '../ui/Slider';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import type { SleepLog, CreateSleepLogDTO } from '@/lib/types';
import { SLEEP_CONSTRAINTS } from '@/lib/constants';

interface SleepEntryFormProps {
  initialData?: SleepLog;
  onSubmit: (data: CreateSleepLogDTO) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function SleepEntryForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SleepEntryFormProps) {
  const [formData, setFormData] = useState({
    sleepDate: initialData?.sleepDate
      ? format(new Date(initialData.sleepDate), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd'),
    sleptAt: initialData?.sleptAt || '23:00',
    wokeAt: initialData?.wokeAt || '07:00',
    qualityRating: initialData?.qualityRating || 7,
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.sleepDate) {
      newErrors.sleepDate = 'Sleep date is required';
    }

    if (!formData.sleptAt || !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(formData.sleptAt)) {
      newErrors.sleptAt = 'Invalid time format (HH:MM)';
    }

    if (!formData.wokeAt || !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(formData.wokeAt)) {
      newErrors.wokeAt = 'Invalid time format (HH:MM)';
    }

    if (
      formData.qualityRating &&
      (formData.qualityRating < SLEEP_CONSTRAINTS.MIN_QUALITY_RATING ||
        formData.qualityRating > SLEEP_CONSTRAINTS.MAX_QUALITY_RATING)
    ) {
      newErrors.qualityRating = `Quality must be between ${SLEEP_CONSTRAINTS.MIN_QUALITY_RATING} and ${SLEEP_CONSTRAINTS.MAX_QUALITY_RATING}`;
    }

    if (formData.notes && formData.notes.length > SLEEP_CONSTRAINTS.MAX_NOTES_LENGTH) {
      newErrors.notes = `Notes cannot exceed ${SLEEP_CONSTRAINTS.MAX_NOTES_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        sleepDate: new Date(formData.sleepDate),
        sleptAt: formData.sleptAt,
        wokeAt: formData.wokeAt,
        qualityRating: formData.qualityRating || undefined,
        notes: formData.notes || undefined,
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleDateShortcut = (date: Date) => {
    setFormData((prev) => ({
      ...prev,
      sleepDate: format(date, 'yyyy-MM-dd'),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DateInput
        label="Sleep Date"
        value={formData.sleepDate}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, sleepDate: e.target.value }))
        }
        onShortcut={handleDateShortcut}
        error={errors.sleepDate}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="time"
          label="Slept At"
          value={formData.sleptAt}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, sleptAt: e.target.value }))
          }
          error={errors.sleptAt}
          required
        />

        <Input
          type="time"
          label="Woke At"
          value={formData.wokeAt}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, wokeAt: e.target.value }))
          }
          error={errors.wokeAt}
          required
        />
      </div>

      <Slider
        label="Sleep Quality"
        min={SLEEP_CONSTRAINTS.MIN_QUALITY_RATING}
        max={SLEEP_CONSTRAINTS.MAX_QUALITY_RATING}
        value={formData.qualityRating}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            qualityRating: Number(e.target.value),
          }))
        }
        showValue
      />

      <TextArea
        label="Notes"
        value={formData.notes}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, notes: e.target.value }))
        }
        placeholder="How did you sleep? Any observations..."
        rows={4}
        maxLength={SLEEP_CONSTRAINTS.MAX_NOTES_LENGTH}
        showCount
        error={errors.notes}
      />

      <div className="flex gap-3">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {initialData ? 'Update' : 'Create'} Sleep Log
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
