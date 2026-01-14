'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmail } from '@/lib/supabaseAuth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <main className="min-h-dvh flex items-center justify-center px-4 relative">
      <div className="absolute top-8 left-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors duration-200 group"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface-1 rounded-xl shadow-glass p-8 flex flex-col gap-5">
        <h1 className="font-display text-2xl font-bold mb-2 text-center">Sign In</h1>
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="rounded-md bg-surface-2 border border-border/10 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="rounded-md bg-surface-2 border border-border/10 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="bg-accent text-accent-fg rounded-md py-2 font-medium transition-colors hover:bg-accent/90 disabled:opacity-60"
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
