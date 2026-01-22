'use client';

import ImmersiveBackground from '@/components/ImmersiveBackground';

export default function PartnersPage() {
  return (
    <main className="min-h-dvh bg-bg text-text-primary relative overflow-hidden">
      <ImmersiveBackground />
      <div className="relative z-10 max-w-3xl mx-auto py-20 px-4 min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Our Partners</h1>
        <p className="text-text-muted mb-8 text-lg">Meet the industry leaders and brands collaborating with ZenPC.</p>
        <section className="grid md:grid-cols-2 gap-8">
          {[
            { name: 'TechGiant', desc: 'Premium hardware supplier for ZenPC builds.' },
            { name: 'CoolerPro', desc: 'Exclusive cooling solutions partner.' },
            { name: 'GameReady', desc: 'Official gaming accessory brand for ZenPC users.' }
          ].map((partner) => (
            <div key={partner.name} className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium">
              <h2 className="text-2xl font-semibold mb-2 text-text-primary">{partner.name}</h2>
              <p className="text-text-muted leading-relaxed">{partner.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
