/**
 * DateInput Component
 * Date picker with shortcuts (Today/Yesterday)
 */

'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  showShortcuts?: boolean;
  onShortcut?: (date: Date) => void;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      error,
      showShortcuts = true,
      onShortcut,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    const handleTodayClick = () => {
      const today = new Date();
      onShortcut?.(today);
    };

    const handleYesterdayClick = () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      onShortcut?.(yesterday);
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <div className="flex gap-2">
          <input
            ref={ref}
            id={inputId}
            type="date"
            className={clsx(
              'flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500',
              className
            )}
            {...props}
          />

          {showShortcuts && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleTodayClick}
                className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleYesterdayClick}
                className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Yesterday
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';
