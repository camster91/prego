import { cn } from '../../utils/cn';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  noPadding?: boolean;
  noBottomPadding?: boolean;
  headerAction?: React.ReactNode;
}

function PageLayout({
  children,
  title,
  subtitle,
  className,
  noPadding = false,
  noBottomPadding = false,
  headerAction
}: PageLayoutProps) {
  return (
    <main
      className={cn(
        'min-h-[calc(100vh-4rem)]',
        !noBottomPadding && 'pb-20', // Space for bottom nav
        className
      )}
    >
      {(title || subtitle || headerAction) && (
        <div
          className={cn(
            'bg-white border-b border-gray-100',
            !noPadding && 'px-4 sm:px-6 lg:px-8 py-6'
          )}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              {title && (
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              )}
              {subtitle && (
                <p className="mt-1 text-gray-500">{subtitle}</p>
              )}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      <div
        className={cn(
          'max-w-7xl mx-auto',
          !noPadding && 'px-4 sm:px-6 lg:px-8 py-6'
        )}
      >
        {children}
      </div>
    </main>
  );
}

export { PageLayout };
