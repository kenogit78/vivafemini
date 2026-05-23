'use client';

import { api } from '@/lib/api';
import type { HealthReport } from '@/types';
import { useFetch, type UseFetchResult } from './useFetch';

export function useHealthReport(month?: string): UseFetchResult<HealthReport> {
  return useFetch<HealthReport>(
    () => api.getHealthReport(month),
    [month],
  );
}
