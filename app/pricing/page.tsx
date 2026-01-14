import React from "react";

export default function PricingPage() {
  return (
    <main className="max-w-3xl mx-auto py-20 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Pricing</h1>
      <p className="text-text-muted mb-8 text-lg">Choose the plan that fits your needs. Transparent pricing, no hidden fees.</p>
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Free</h2>
          <p className="text-text-muted">Basic PC builder access, community forums, and guides.</p>
          <span className="text-xs text-accent">$0/month</span>
        </div>
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Pro</h2>
          <p className="text-text-muted">Advanced compatibility, expert support, and exclusive deals.</p>
          <span className="text-xs text-accent">$9.99/month</span>
        </div>
      </section>
    </main>
  );
}
