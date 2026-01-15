'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function TermsPage() {
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let targetX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let targetY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isClient) return;
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      setSmoothPosition(prev => ({
        x: prev.x + (targetX - prev.x) * 0.1,
        y: prev.y + (targetY - prev.y) * 0.1
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isClient]);

  return (
    <main className="min-h-dvh bg-bg text-text-primary relative overflow-hidden">
      <div style={{
        position: 'fixed',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)',
        left: `${smoothPosition.x}px`,
        top: `${smoothPosition.y}px`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(30px)',
        willChange: 'transform',
        transition: 'opacity 0.3s ease-out',
        opacity: 1
      }} />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors duration-base ease-premium group"
          >
            <svg className="w-4 h-4 transition-transform duration-base ease-premium group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="card p-8 md:p-12 space-y-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-text-muted text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Acceptance of Terms</h2>
            <p className="text-text-muted leading-relaxed">
              By accessing or using ZenPC (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p className="text-text-muted leading-relaxed">
              These Terms apply to all users of the Service, including without limitation users who are browsers, vendors, customers, merchants, and contributors of content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Use of Service</h2>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Eligibility</h3>
              <p className="text-text-muted leading-relaxed">
                You must be at least 13 years old to use ZenPC. By using the Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Permitted Use</h3>
              <p className="text-text-muted leading-relaxed">
                You may use ZenPC for lawful purposes only. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                <li>Use the Service in any way that violates applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to the Service or its related systems</li>
                <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                <li>Use automated systems (bots, scrapers) to access the Service without permission</li>
                <li>Reproduce, duplicate, copy, or resell any part of the Service without our written permission</li>
                <li>Use the Service to transmit any malicious code, viruses, or harmful data</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Account Responsibilities</h2>
            <p className="text-text-muted leading-relaxed">
              When you create an account with ZenPC, you are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Ensuring that your account information is accurate and up to date</li>
            </ul>
            <p className="text-text-muted leading-relaxed mt-4">
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent, abusive, or illegal activity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Accuracy and Disclaimers</h2>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Compatibility Information</h3>
              <p className="text-text-muted leading-relaxed">
                While we strive for accuracy, ZenPC provides compatibility information and recommendations based on manufacturer specifications and industry standards. We cannot guarantee that all compatibility checks are 100% accurate or that all parts will work together perfectly in every configuration.
              </p>
              <p className="text-text-muted leading-relaxed mt-2">
                You are responsible for verifying compatibility with manufacturers and retailers before making purchases. We recommend double-checking critical compatibility requirements, especially for high-value builds.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Pricing Information</h3>
              <p className="text-text-muted leading-relaxed">
                Pricing information is provided for reference only and may not reflect current market prices. Prices can change frequently, and we do not guarantee the accuracy of pricing data. Always verify current prices with retailers before purchasing.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Service Availability</h3>
              <p className="text-text-muted leading-relaxed">
                We strive to maintain continuous availability of the Service, but we do not guarantee uninterrupted access. The Service may be unavailable due to maintenance, updates, or circumstances beyond our control.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Limitation of Liability</h2>
            <p className="text-text-muted leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZENPC AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Your use or inability to use the Service</li>
              <li>Any errors or inaccuracies in compatibility information</li>
              <li>Any decisions made based on information provided by the Service</li>
              <li>Any purchases made based on recommendations from the Service</li>
              <li>Unauthorized access to or use of our servers or your account</li>
            </ul>
            <p className="text-text-muted leading-relaxed mt-4">
              Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid to us (if any) in the twelve months preceding the claim, or $100, whichever is greater.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Intellectual Property</h2>
            <p className="text-text-muted leading-relaxed">
              The Service, including its original content, features, and functionality, is owned by ZenPC and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-text-muted leading-relaxed">
              You may not modify, reproduce, distribute, create derivative works, publicly display, or commercially exploit any part of the Service without our express written permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">User Content</h2>
            <p className="text-text-muted leading-relaxed">
              You retain ownership of any content you create or upload to ZenPC (such as build configurations and notes). By using the Service, you grant us a license to store, display, and process this content solely for the purpose of providing the Service.
            </p>
            <p className="text-text-muted leading-relaxed">
              If you choose to make a build public, you grant us the right to display that build to other users of the Service. You can change the visibility of your builds at any time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Termination</h2>
            <p className="text-text-muted leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
            <p className="text-text-muted leading-relaxed">
              You may terminate your account at any time by deleting it through your account settings. Upon termination, your data will be deleted in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Changes to Terms</h2>
            <p className="text-text-muted leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such changes constitutes acceptance of the modified Terms.
            </p>
            <p className="text-text-muted leading-relaxed">
              If you do not agree to the modified Terms, you must stop using the Service and may delete your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Governing Law</h2>
            <p className="text-text-muted leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved through appropriate legal channels.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Contact Information</h2>
            <p className="text-text-muted leading-relaxed">
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="text-text-muted">
              Email: <a href="mailto:support@zenpc.app" className="text-accent hover:underline">support@zenpc.app</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
