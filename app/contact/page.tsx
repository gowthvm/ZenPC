import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | ZenPC',
};

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-bold mb-4">Contact</h1>
      <p className="mb-4">Have questions or feedback? Reach out to us:</p>
      <ul className="mb-4 list-disc pl-6 text-text-muted">
        <li>Email: <a href="mailto:support@zenpc.app" className="text-accent underline">support@zenpc.app</a></li>
      </ul>
      <p>We aim to respond within 2 business days.</p>
    </main>
  );
}
