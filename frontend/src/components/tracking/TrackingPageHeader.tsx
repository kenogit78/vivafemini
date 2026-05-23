'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export interface TrackingPageHeaderProps {
  date?: string;
}

export function TrackingPageHeader({ date }: TrackingPageHeaderProps) {
  const today = new Date().toISOString().split('T')[0];
  const subtitle =
    date && date !== today
      ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : null;

  return (
    <div className="mb-2 flex items-center gap-2 lg:hidden">
      <Link
        href="/"
        className="rounded-full p-1 text-text-primary transition-colors hover:bg-white active:scale-95"
        aria-label="Back to home"
      >
        <ChevronLeft className="h-6 w-6" />
      </Link>
      <div className="flex-1 text-center">
        <h1 className="text-base font-bold text-text-primary">
          Log Menstrual Symptoms
        </h1>
        {subtitle && (
          <p className="text-xs text-text-secondary">For {subtitle}</p>
        )}
      </div>
      <span className="w-7" aria-hidden />
    </div>
  );
}
