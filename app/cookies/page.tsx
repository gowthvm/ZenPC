import React from "react";

export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto py-20 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Cookies Policy</h1>
      <p className="text-text-muted mb-8 text-lg">How ZenPC uses cookies and how you can manage them.</p>
      <section className="space-y-8">
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">What Are Cookies?</h2>
          <p className="text-text-muted">Cookies are small text files stored on your device to enhance your browsing experience.</p>
        </div>
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Managing Cookies</h2>
          <p className="text-text-muted">You can control and delete cookies through your browser settings.</p>
        </div>
      </section>
    </main>
  );
}
