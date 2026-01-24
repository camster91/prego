import { Link } from 'react-router-dom';
import { Heart, Settings } from 'lucide-react';
import { useUserStore } from '../../../stores';
import { Button } from '../ui/Button';
import { TrimesterBadge } from '../ui/Badge';

function Header() {
  const profile = useUserStore((state) => state.profile);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Prego</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {profile && (
              <div className="hidden sm:flex items-center gap-3">
                <TrimesterBadge trimester={profile.currentTrimester} />
                <span className="text-sm text-gray-500">
                  Week {profile.currentWeek}
                </span>
              </div>
            )}

            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export { Header };
