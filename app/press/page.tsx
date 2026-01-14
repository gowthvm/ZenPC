import React from "react";

export default function PressPage() {
  return (
    <main className="max-w-3xl mx-auto py-20 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Press & Media</h1>
      <p className="text-text-muted mb-8 text-lg">Media resources, company news, and press releases for ZenPC.</p>
      <section className="space-y-8">
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">ZenPC Launches Next-Gen Builder</h2>
          <p className="text-text-muted">ZenPC unveils its revolutionary PC builder platform with real-time compatibility and curated components.</p>
          <span className="text-xs text-accent">Jan 2026</span>
        </div>
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Featured in TechWorld</h2>
          <p className="text-text-muted">TechWorld highlights ZenPC as the go-to platform for PC enthusiasts and professionals alike.</p>
          <span className="text-xs text-accent">Dec 2025</span>
        </div>
      </section>
    </main>
  );
}
