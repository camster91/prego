import { StorageNotice } from '../../components/StorageNotice';
import { Outlet } from 'react-router-dom';
import { Header } from '../../shared/components/layout/Header';
import { BottomNav } from '../../shared/components/layout/BottomNav';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-sage-50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-4">Skip to content</a>
      <Header />
      <StorageNotice />
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
