import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, PartyPopper } from 'lucide-react';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Redirect if accessed without a valid session_id
    if (!sessionId) {
      navigate('/pricing');
      return;
    }
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [sessionId, navigate]);

  if (!sessionId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          {showConfetti && (
            <PartyPopper className="w-8 h-8 text-yellow-500 absolute top-0 right-1/3 animate-bounce" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Premium!</h1>
        <p className="text-lg text-gray-600 mb-2">
          Your subscription is active. You now have full access to all workouts, custom plans, and progress tracking.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          A confirmation email has been sent to your inbox.
        </p>

        <div className="space-y-3">
          <Link
            to="/workouts"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors"
          >
            Start a Workout <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/"
            className="block w-full py-3 rounded-lg font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
