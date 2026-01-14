import React from "react";

export default function DocsPage() {
  return (
    <main className="max-w-3xl mx-auto py-20 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Documentation</h1>
      <p className="text-text-muted mb-8 text-lg">Official documentation for ZenPC features, API, and integrations.</p>
      <section className="space-y-8">
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">User Guide</h2>
          <p className="text-text-muted">Step-by-step instructions for using ZenPC's builder and tools.</p>
        </div>
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">API Reference</h2>
          <p className="text-text-muted">Comprehensive API docs for developers and partners.</p>
        </div>
      </section>
    </main>
  );
}
