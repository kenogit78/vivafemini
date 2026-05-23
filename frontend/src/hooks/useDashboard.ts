'use client';

import { api } from '@/lib/api';
import type { DashboardData } from '@/types';
import { useFetch, type UseFetchResult } from './useFetch';

export function useDashboard(): UseFetchResult<DashboardData> {
  return useFetch<DashboardData>(() => api.getDashboard(), []);
}
