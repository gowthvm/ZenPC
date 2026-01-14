import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ZenPC',
};

export default function PrivacyPage() {
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
      <h1 className="font-display text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Your privacy is important to us. ZenPC does not sell your data or share it with third parties. We collect only the information necessary to provide our service, such as your email for authentication and your saved PC builds.</p>
      <p>All data is stored securely. You can delete your account and associated data at any time. For questions, contact us at <a href="mailto:support@zenpc.app" className="text-accent underline">support@zenpc.app</a>.</p>
    </main>
  );
}
