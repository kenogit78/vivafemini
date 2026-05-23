'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '@/lib/api';
import { emitDataChanged } from '@/lib/app-events';
import { cn } from '@/lib/cn';

export interface ReferralBannerProps {
  initialDismissed?: boolean;
  className?: string;
}

export function ReferralBanner({
  initialDismissed = false,
  className,
}: ReferralBannerProps) {
  const [dismissed, setDismissed] = useState<boolean>(initialDismissed);

  if (dismissed) {
    return null;
  }

  const handleDismiss = (): void => {
    setDismissed(true);
    void api
      .updateUser({ referralBannerDismissed: true })
      .then(() => emitDataChanged())
      .catch(() => {});
  };

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
        aria-label="Dismiss referral banner"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex-1 pr-8">
        <p className="font-bold text-text-primary">
          Refer your friends to VivaFemini 💕🎊
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Gift your friend 30 days of free Premium to help them thrive
        </p>
      </div>

      <span className="text-3xl" aria-hidden>
        🎉
      </span>
    </div>
  );
}
