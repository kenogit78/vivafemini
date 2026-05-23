'use client';

import { useCallback, useEffect, useState } from 'react';
import { DATA_CHANGED_EVENT } from '@/lib/app-events';

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setData(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    const onDataChanged = (): void => {
      void refetch();
    };
    window.addEventListener(DATA_CHANGED_EVENT, onDataChanged);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, onDataChanged);
  }, [refetch]);

  return { data, loading, error, refetch };
}
