import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ZenPC',
};

export default function TermsPage() {
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
      <h1 className="font-display text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">By using ZenPC, you agree to use the app for lawful purposes only. We do not guarantee the accuracy of compatibility data and are not liable for any damages resulting from its use.</p>
      <p>ZenPC may update these terms as needed. Continued use of the service constitutes acceptance of any changes.</p>
    </main>
  );
}
