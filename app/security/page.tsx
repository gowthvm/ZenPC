import React from "react";

export default function SecurityPage() {
  return (
    <main className="max-w-3xl mx-auto py-20 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Security</h1>
      <p className="text-text-muted mb-8 text-lg">Learn how ZenPC protects your data and privacy.</p>
      <section className="space-y-8">
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Data Encryption</h2>
          <p className="text-text-muted">All sensitive data is encrypted both in transit and at rest.</p>
        </div>
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Responsible Disclosure</h2>
          <p className="text-text-muted">We encourage security researchers to report vulnerabilities responsibly.</p>
        </div>
      </section>
    </main>
  );
}
