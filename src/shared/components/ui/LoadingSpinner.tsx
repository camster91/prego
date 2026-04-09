import { Suspense } from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full min-h-[200px]" role="status">
      <div className="w-9 h-9 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  );
}
