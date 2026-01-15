'use client';

import { ImmersiveBackground } from '../components/ImmersiveBackground';

export default function CommunityPage() {
  return (
    <main className="min-h-dvh bg-bg text-text-primary relative overflow-hidden">
      <ImmersiveBackground />
      <div className="relative z-10 max-w-4xl mx-auto py-20 px-4 min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">ZenPC Community</h1>
        <p className="text-text-muted mb-8 text-lg">Connect with fellow PC builders, share your builds, and get advice from experts.</p>
        <section className="space-y-8">
          <div className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Forums</h2>
            <p className="text-text-muted leading-relaxed">Join discussions, ask questions, and showcase your latest builds.</p>
          </div>
          <div className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Events</h2>
            <p className="text-text-muted leading-relaxed">Participate in online build competitions and webinars.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
