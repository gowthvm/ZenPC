import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | ZenPC',
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors duration-200 group"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>
      <h1 className="font-display text-3xl font-bold mb-4">About ZenPC</h1>
      <p className="mb-4">ZenPC is a premium web app designed to make building custom PCs simple, clear, and trustworthy. Our goal is to provide a calm, distraction-free experience for enthusiasts and newcomers alike.</p>
      <p>We believe in transparency, privacy, and putting users first—no ads, no upsells, just a clean interface and reliable compatibility checks.</p>
    </main>
  );
}
