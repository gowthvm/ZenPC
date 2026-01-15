'use client';

import { ImmersiveBackground } from '../components/ImmersiveBackground';

export default function StatusPage() {
  return (
    <main className="min-h-dvh bg-bg text-text-primary relative overflow-hidden">
      <ImmersiveBackground />
      <div className="relative z-10 max-w-4xl mx-auto py-20 px-4 min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">System Status</h1>
        <p className="text-text-muted mb-8 text-lg">Check the current operational status of ZenPC services.</p>
        <section className="space-y-10">
          <div className="card p-8 flex flex-col items-center group hover:scale-[1.02] transition-all duration-base ease-premium border-accent/20">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center mb-4 shadow-glass">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-text-primary">All Systems Operational</h2>
            <p className="text-text-muted mb-2 text-center">There are currently no reported issues. All ZenPC services are running smoothly.</p>
            <span className="text-xs text-accent font-medium">Updated just now</span>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {['Website', 'API', 'Authentication', 'Database'].map((service) => (
              <div key={service} className="card p-6 flex items-center gap-4 group hover:scale-[1.02] transition-all duration-base ease-premium">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <div>
                  <div className="font-medium text-text-primary">{service}</div>
                  <div className="text-xs text-text-muted">Operational</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
