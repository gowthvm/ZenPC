import React from "react";

export default function HelpPage() {
  return (
    <main className="max-w-3xl mx-auto py-20 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Help Center</h1>
      <p className="text-text-muted mb-8 text-lg">Find answers to common questions and get support for ZenPC.</p>
      <section className="space-y-8">
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Getting Started</h2>
          <p className="text-text-muted">How to build your first PC with ZenPC.</p>
        </div>
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Account Issues</h2>
          <p className="text-text-muted">Trouble logging in or managing your account? We&apos;re here to help.</p>
        </div>
      </section>
    </main>
  );
}
