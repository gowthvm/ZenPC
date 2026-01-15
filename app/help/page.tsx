'use client';

import { ImmersiveBackground } from '../components/ImmersiveBackground';

export default function HelpPage() {
  return (
    <main className="min-h-dvh bg-bg text-text-primary relative overflow-hidden">
      <ImmersiveBackground />
      <div className="relative z-10 max-w-3xl mx-auto py-20 px-4 min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Help Center</h1>
        <p className="text-text-muted mb-8 text-lg">Find answers to common questions and get support for ZenPC.</p>
        <section className="space-y-8">
          <div className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Getting Started</h2>
            <p className="text-text-muted leading-relaxed">How to build your first PC with ZenPC.</p>
          </div>
          <div className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Account Issues</h2>
            <p className="text-text-muted leading-relaxed">Trouble logging in or managing your account? We&apos;re here to help.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
