import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | ZenPC',
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-bold mb-4">About ZenPC</h1>
      <p className="mb-4">ZenPC is a premium web app designed to make building custom PCs simple, clear, and trustworthy. Our goal is to provide a calm, distraction-free experience for enthusiasts and newcomers alike.</p>
      <p>We believe in transparency, privacy, and putting users first—no ads, no upsells, just a clean interface and reliable compatibility checks.</p>
    </main>
  );
}
