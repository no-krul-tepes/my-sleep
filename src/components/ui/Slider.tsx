/**
 * Slider Component
 * Range input for quality rating (1-10)
 */

'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { clsx } from 'clsx';

interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  min?: number;
  max?: number;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      showValue = true,
      min = 1,
      max = 10,
      value,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      value ? Number(value) : min
    );

    const displayValue = value !== undefined ? Number(value) : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setInternalValue(newValue);
      onChange?.(e);
    };

    // Calculate percentage for gradient
    const percentage = ((displayValue - min) / (max - min)) * 100;

    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            {showValue && (
              <span className="text-sm font-semibold text-indigo-600">
                {displayValue}
              </span>
            )}
          </div>
        )}

        <div className="relative">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            value={displayValue}
            onChange={handleChange}
            className={clsx(
              'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-5',
              '[&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-indigo-600',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:shadow-md',
              '[&::-webkit-slider-thumb]:transition-transform',
              '[&::-webkit-slider-thumb]:hover:scale-110',
              '[&::-moz-range-thumb]:w-5',
              '[&::-moz-range-thumb]:h-5',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-indigo-600',
              '[&::-moz-range-thumb]:border-0',
              '[&::-moz-range-thumb]:cursor-pointer',
              '[&::-moz-range-thumb]:shadow-md',
              className
            )}
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
            }}
            {...props}
          />

          {/* Value labels */}
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">{min}</span>
            <span className="text-xs text-gray-500">{max}</span>
          </div>
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
