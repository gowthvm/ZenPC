'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmail } from '@/lib/supabaseAuth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const [isClient, setIsClient] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signInWithEmail(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/app');
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 relative bg-bg overflow-hidden">
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
      
      <div className="absolute top-8 left-6 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors duration-base ease-premium group"
        >
          <svg className="w-4 h-4 transition-transform duration-base ease-premium group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-sm card p-8 flex flex-col gap-5 relative z-10">
        <h1 className="font-display text-2xl font-bold mb-2 text-center">Sign In</h1>
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="rounded-md bg-surface-1/60 backdrop-blur-glass border border-border/20 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-base ease-premium"
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="rounded-md bg-surface-1/60 backdrop-blur-glass border border-border/20 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-base ease-premium"
        />
        {error && <div className="card p-3 bg-red-500/10 border-red-500/30 text-red-400 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="bg-accent text-accent-fg rounded-md py-2 font-medium transition-all duration-base ease-premium hover:bg-accent/90 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <div className="text-center text-sm text-text-muted">
          Don&apos;t have an account? <a href="/register" className="text-accent underline">Register</a>
        </div>
      </form>
    </main>
  );
}
