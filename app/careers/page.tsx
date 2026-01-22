'use client';

import ImmersiveBackground from '@/components/ImmersiveBackground';

export default function CareersPage() {
  return (
    <main className="min-h-dvh bg-bg text-text-primary relative overflow-hidden">
      <ImmersiveBackground />
      <div className="relative z-10 max-w-3xl mx-auto py-20 px-4 min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Careers at ZenPC</h1>
        <p className="text-text-muted mb-8 text-lg">Join our mission to revolutionize PC building. Explore open positions below.</p>
        <section className="space-y-8">
          <div className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Frontend Developer</h2>
            <p className="text-text-muted mb-3 leading-relaxed">Work with React, TypeScript, and Tailwind to deliver beautiful user experiences.</p>
            <span className="text-sm font-medium text-accent">Remote | Full-time</span>
          </div>
          <div className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Content Strategist</h2>
            <p className="text-text-muted mb-3 leading-relaxed">Shape the voice of ZenPC through engaging guides, blogs, and social media.</p>
            <span className="text-sm font-medium text-accent">Remote | Part-time</span>
          </div>
        </section>
      </div>
    </main>
  );
}
