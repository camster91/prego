import { Outlet } from 'react-router-dom';
import { Header } from '../../shared/components/layout/Header';
import { BottomNav } from '../../shared/components/layout/BottomNav';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-sage-50">
      <Header />
      <Outlet />
      <BottomNav />
    </div>
  );
}

export function WorkoutLayout() {
  // No bottom nav during active workout
  return (
    <div className="min-h-screen bg-sage-50">
      <Outlet />
    </div>
  );
}
