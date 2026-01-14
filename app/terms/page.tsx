import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ZenPC',
};

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">By using ZenPC, you agree to use the app for lawful purposes only. We do not guarantee the accuracy of compatibility data and are not liable for any damages resulting from its use.</p>
      <p>ZenPC may update these terms as needed. Continued use of the service constitutes acceptance of any changes.</p>
    </main>
  );
}
