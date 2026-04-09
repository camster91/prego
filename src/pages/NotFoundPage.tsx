import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../shared/components/ui/Button';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 p-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-primary-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="gap-2">
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export { NotFoundPage };
