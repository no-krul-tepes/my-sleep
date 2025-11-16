/**
 * API response types
 */

import type { SleepLog } from './sleep';

export interface ApiResponse<T> {
  data: T;
  error?: never;
}

export interface ApiError {
  data?: never;
  error: {
    message: string;
    code: string;
    status: number;
    details?: Record<string, unknown>;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore?: boolean;
}

export interface SleepLogsListResponse {
  data: SleepLog[];
  count: number;
}

export interface SleepLogResponse {
  data: SleepLog;
}

export interface DeleteResponse {
  success: boolean;
}
