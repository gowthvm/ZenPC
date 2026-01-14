import React from "react";

export default function UpdatesPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Updates & Announcements</h1>
      <p className="text-text-muted mb-8 text-lg">Stay up to date with the latest features, improvements, and news from ZenPC.</p>
      <section className="space-y-12">
          <ol className="relative border-l border-accent/40 ml-4">
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-accent rounded-full -left-4 ring-4 ring-surface-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </span>
              <h2 className="text-2xl font-semibold mb-1 text-text-primary">ZenPC v1.0.0 Released</h2>
              <p className="text-text-muted mb-2">Our first major release is live! Explore new features and enhancements.</p>
              <span className="text-xs text-accent">Jan 2026</span>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-gradient-to-br from-accent to-purple-600 rounded-full -left-4 ring-4 ring-surface-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              <h2 className="text-2xl font-semibold mb-1 text-text-primary">Beta Program Completed</h2>
              <p className="text-text-muted mb-2">Thank you to our early users for invaluable feedback during the beta phase.</p>
              <span className="text-xs text-accent">Dec 2025</span>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-surface-3 border border-accent rounded-full -left-4 ring-4 ring-surface-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </span>
              <h2 className="text-2xl font-semibold mb-1 text-text-primary">ZenPC Announced</h2>
              <p className="text-text-muted mb-2">We revealed our vision for a smarter, more accessible PC builder.</p>
              <span className="text-xs text-accent">Oct 2025</span>
            </li>
          </ol>
        <div className="bg-surface-2 rounded-xl border border-border/10 p-6 shadow">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">ZenPC v1.0.0 Released</h2>
          <p className="text-text-muted">Our first major release is live! Explore new features and enhancements.</p>
          <span className="text-xs text-accent">Jan 2026</span>
        </div>
      </section>
    </main>
  );
}
