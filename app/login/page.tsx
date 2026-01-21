'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signInWithEmail } from '@/lib/supabaseAuth';
import { CursorGlow } from '@/components/effects/MagneticElement';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';

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
      router.push('/builder');
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 relative bg-bg overflow-hidden">
      {/* Background effects */}
      <CursorGlow color="rgb(99, 112, 241)" size={500} blur={60} opacity={0.15} />

      {/* Decorative blobs */}
      <div className="fixed -top-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="fixed -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl" />

      {/* Back link */}
      <motion.div
        className="absolute top-8 left-6 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-8 rounded-2xl bg-surface-1/60 backdrop-blur-xl border border-border/20 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="font-display text-xl font-bold text-white">Z</span>
              </motion.div>
            </Link>
          </div>

          <h1 className="font-display text-2xl font-bold text-center text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-text-muted text-center text-sm mb-8">
            Sign in to continue building your dream PC
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/50" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-2/50 border border-border/20 text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/50" />
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-2/50 border border-border/20 text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent to-purple-600 text-white font-semibold shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>

            {/* Register link */}
            <p className="text-center text-sm text-text-muted pt-4">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-accent hover:underline font-medium">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
