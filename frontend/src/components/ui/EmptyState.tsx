import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  emoji?: string;
  message: string;
  className?: string;
}

export function EmptyState({
  emoji = '📭',
  message,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card bg-white py-10 text-center shadow-sm',
        className,
      )}
    >
      <span className="text-3xl" aria-hidden>
        {emoji}
      </span>
      <p className="mt-3 text-sm text-text-secondary">{message}</p>
    </div>
  );
}
