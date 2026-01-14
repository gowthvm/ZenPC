import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex bg-bg text-text-primary">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-surface-1/80 border-r border-border/10 px-4 py-6 gap-4 shadow-glass">
        <div className="font-display text-xl font-bold mb-8 tracking-tight select-none">ZenPC</div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/app" className="rounded-lg px-3 py-2 hover:bg-surface-2/60 font-medium transition-colors">My Builds</Link>
          <Link href="/app/new" className="rounded-lg px-3 py-2 hover:bg-surface-2/60 font-medium transition-colors">New Build</Link>
          <Link href="/app/account" className="rounded-lg px-3 py-2 hover:bg-surface-2/60 font-medium transition-colors">Account</Link>
        </nav>
      </aside>
      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center border-b border-border/10 bg-surface-1/80 px-6 shadow-glass">
          <div className="flex-1 font-medium text-text-muted">No build in progress</div>
          {/* Placeholder for user menu, notifications, etc. */}
        </header>
        {/* Main content */}
        <main className="flex-1 p-6 bg-bg/80 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
