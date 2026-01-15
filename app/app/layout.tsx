'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Home, Settings, LogOut, LayoutDashboard, Cpu, BookOpen } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'PC Builder', href: '/app/builder', icon: Cpu },
  { name: 'Build Guide', href: '/app/guide', icon: BookOpen },
  { name: 'Account', href: '/app/account', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const [isClient, setIsClient] = useState(false);

  // Check user session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUser({ email: user.email });
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Close sidebar when navigating
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Smooth cursor effect with requestAnimationFrame
  useEffect(() => {
    setIsClient(true);
    
    let targetX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let targetY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isClient) return;
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      setSmoothPosition(prev => ({
        x: prev.x + (targetX - prev.x) * 0.1,
        y: prev.y + (targetY - prev.y) * 0.1
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isClient]);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-text-primary relative overflow-hidden">
      {/* Purple cursor effect */}
      <div style={{
        position: 'fixed',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)',
        left: `${smoothPosition.x}px`,
        top: `${smoothPosition.y}px`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(30px)',
        willChange: 'transform',
        transition: 'opacity 0.3s ease-out',
        opacity: 1
      }} />
      
      {/* Content wrapper */}
      <div className="relative flex h-screen overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-surface-2/80 backdrop-blur-glass border-r border-border/10 transition-transform duration-300 ease-premium md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border/10">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center font-display text-sm font-bold text-white select-none shadow-lg">
                Z
              </div>
              <span className="font-display text-xl font-semibold">ZenPC</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-base ease-premium ${
                    isActive
                      ? 'bg-surface-1/60 text-accent shadow-glass border border-accent/20'
                      : 'text-text-muted hover:bg-surface-1/40 hover:text-text-primary hover:border border-transparent hover:border-border/20'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and sign out */}
          {!loading && user && (
            <div className="p-4 border-t border-border/10">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-1/50 backdrop-blur-glass border border-border/10">
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-text-muted">Free Plan</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-text-muted hover:text-text-primary hover:bg-surface-2/50 transition-all duration-base ease-premium"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border/10 bg-surface-1/40 backdrop-blur-glass z-40">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-surface-2/50"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center font-display text-sm font-bold text-white select-none shadow-lg">
              Z
            </div>
            <span className="font-display text-xl font-semibold">ZenPC</span>
          </Link>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl py-8">
            {children}
          </div>
        </main>
      </div>
      </div>
    </div>
  );
}
