import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | ZenPC',
};

export default function ContactPage() {
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
      <h1 className="font-display text-3xl font-bold mb-4">Contact</h1>
      <p className="mb-4">Have questions or feedback? Reach out to us:</p>
      <ul className="mb-4 list-disc pl-6 text-text-muted">
        <li>Email: <a href="mailto:support@zenpc.app" className="text-accent underline">support@zenpc.app</a></li>
      </ul>
      <p>We aim to respond within 2 business days.</p>
    </main>
  );
}
