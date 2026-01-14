import React from "react";

export default function BlogPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">ZenPC Blog</h1>
      <p className="text-text-muted mb-8 text-lg">Insights, news, and tips from the ZenPC team.</p>
      <section className="grid gap-8 md:grid-cols-2">
        {/* Example blog posts */}
        <article className="rounded-xl bg-surface-2 border border-border/10 p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Building the Ultimate Gaming PC in 2026</h2>
          <p className="text-text-muted mb-4">A comprehensive guide to the best components and configurations for a high-end gaming rig this year.</p>
          <a href="#" className="text-accent hover:underline">Read more →</a>
        </article>
        <article className="rounded-xl bg-surface-2 border border-border/10 p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">How ZenPC Ensures Compatibility</h2>
          <p className="text-text-muted mb-4">Learn about our real-time compatibility engine and how it helps you avoid costly mistakes.</p>
          <a href="#" className="text-accent hover:underline">Read more →</a>
        </article>
        <article className="rounded-xl bg-surface-2 border border-border/10 p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">The Future of PC Building</h2>
          <p className="text-text-muted mb-4">Trends and predictions for the next generation of custom PC builds.</p>
          <a href="#" className="text-accent hover:underline">Read more →</a>
        </article>
        <article className="rounded-xl bg-surface-2 border border-border/10 p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">Meet the ZenPC Team</h2>
          <p className="text-text-muted mb-4">Get to know the people behind ZenPC and our mission to empower PC builders.</p>
          <a href="#" className="text-accent hover:underline">Read more →</a>
        </article>
      </section>
    </main>
  );
}
