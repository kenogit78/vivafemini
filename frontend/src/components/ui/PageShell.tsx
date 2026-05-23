import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

export interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return <div className={cn('animate-fadeIn', className)}>{children}</div>;
}
