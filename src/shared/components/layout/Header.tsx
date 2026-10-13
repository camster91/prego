import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
function Header() {
  return <header className="sticky top-0 z-40 border-b border-sage-200 bg-sage-50/95 backdrop-blur-lg pt-safe">
    <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-5">
      <Link to="/" aria-label="Prego today" className="flex min-h-12 items-center gap-2 text-primary-900"><img src="/media/icon-192.png" width="36" height="36" alt="" className="rounded-xl" /><span className="text-2xl font-semibold tracking-tight">prego<span className="text-accent-600">.</span></span></Link>
      <Link to="/learn#safety" className="flex min-h-12 items-center gap-2 text-sm text-primary-800"><ShieldCheck aria-hidden="true" className="h-5 w-5" />Safety & care</Link>
    </div>
  </header>;
}
export { Header };
