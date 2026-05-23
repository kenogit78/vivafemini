import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  message,
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-card border border-primary/20 bg-primary-bg p-6 text-center',
        className,
      )}
      role="alert"
    >
      <AlertCircle className="h-8 w-8 text-primary" aria-hidden />
      <p className="text-sm font-medium text-text-primary">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-pill bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-light active:scale-95"
        >
          Retry
        </button>
      )}
    </div>
  );
}
