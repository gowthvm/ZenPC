import React from "react";

export default function CommunityPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">ZenPC Community</h1>
      <p className="text-text-muted mb-8 text-lg">Connect with fellow PC builders, share your builds, and get advice from experts.</p>
      <section className="space-y-8">
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Forums</h2>
          <p className="text-text-muted">Join discussions, ask questions, and showcase your latest builds.</p>
        </div>
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Events</h2>
          <p className="text-text-muted">Participate in online build competitions and webinars.</p>
        </div>
      </section>
    </main>
  );
}
