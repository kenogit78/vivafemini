import { ErrorMessage } from './ErrorMessage';
import { Spinner } from './Spinner';

export function PageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" label="Loading" />
    </div>
  );
}

export interface PageErrorProps {
  onRetry: () => void;
}

export function PageError({ onRetry }: PageErrorProps) {
  return (
    <div className="px-4 py-12">
      <ErrorMessage message="Failed to load data" onRetry={onRetry} />
    </div>
  );
}
