'use client';

import Link from 'next/link';
import { cn } from '@/lib/cn';

const ACTIONS = [
  { href: '/tracking', icon: '📊', label: 'Log symptoms' },
  { href: '/tracking?log=period', icon: '📅', label: 'Log period' },
  { href: '/health-report', icon: '💊', label: 'Health Report' },
] as const;

export interface QuickActionProps {
  className?: string;
}

export function QuickAction({ className }: QuickActionProps) {
  return (
    <div className={cn(className)}>
      <h3 className="mb-3 text-sm font-bold text-primary">Quick Action</h3>
      <div className="grid grid-cols-3 gap-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-1.5 rounded-card border border-primary/30 bg-white px-2 py-3 text-center transition-all duration-150 hover:border-primary hover:bg-primary-bg active:scale-95"
          >
            <span className="text-xl" aria-hidden>
              {action.icon}
            </span>
            <span className="text-[11px] font-medium leading-tight text-primary">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
