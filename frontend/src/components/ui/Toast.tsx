'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/cn';

export type ToastVariant = 'success' | 'error';

export interface ToastProps {
  message: string;
  variant: ToastVariant;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({
  message,
  variant,
  onDismiss,
  durationMs = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [onDismiss, durationMs]);

  return (
    <div
      role="alert"
      className={cn(
        'fixed z-[100] mx-4 w-auto max-w-sm rounded-card px-4 py-3 text-sm font-medium text-white shadow-lg',
        'left-1/2 top-4 -translate-x-1/2 md:left-auto md:right-6 md:top-6 md:translate-x-0',
        variant === 'success' ? 'bg-emerald-600' : 'bg-red-600',
      )}
    >
      {message}
    </div>
  );
}
