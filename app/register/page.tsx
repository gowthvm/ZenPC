'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail } from '@/lib/supabaseAuth';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signUpWithEmail(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/app');
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface-1 rounded-xl shadow-glass p-8 flex flex-col gap-5">
        <h1 className="font-display text-2xl font-bold mb-2 text-center">Register</h1>
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
          autoComplete="new-password"
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
          {loading ? 'Registering…' : 'Register'}
        </button>
        <div className="text-center text-sm text-text-muted">
          Already have an account? <a href="/login" className="text-accent underline">Sign In</a>
        </div>
      </form>
    </main>
  );
}
