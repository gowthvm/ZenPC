import React from "react";

export default function PartnersPage() {
  return (
    <main className="max-w-3xl mx-auto py-20 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Our Partners</h1>
      <p className="text-text-muted mb-8 text-lg">Meet the industry leaders and brands collaborating with ZenPC.</p>
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">TechGiant</h2>
          <p className="text-text-muted">Premium hardware supplier for ZenPC builds.</p>
        </div>
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">CoolerPro</h2>
          <p className="text-text-muted">Exclusive cooling solutions partner.</p>
        </div>
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">GameReady</h2>
          <p className="text-text-muted">Official gaming accessory brand for ZenPC users.</p>
        </div>
      </section>
    </main>
  );
}
