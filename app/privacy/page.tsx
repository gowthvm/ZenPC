'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-text-muted text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Introduction</h2>
            <p className="text-text-muted leading-relaxed">
              At ZenPC, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. By using ZenPC, you consent to the data practices described in this policy.
            </p>
            <p className="text-text-muted leading-relaxed">
              We are committed to transparency and giving you control over your data. We don&apos;t sell your information, we don&apos;t use it for advertising, and we only collect what&apos;s necessary to provide our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Information We Collect</h2>
            
            <div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Account Information</h3>
              <p className="text-text-muted leading-relaxed">
                When you create an account, we collect your email address for authentication and communication purposes. We do not require your real name or any other personal information.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Build Data</h3>
              <p className="text-text-muted leading-relaxed">
                We store your saved PC builds, including selected parts, build names, and any notes you add. This data is private by default and only accessible to you. You can choose to make builds public, but this is always your decision.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Usage Information</h3>
              <p className="text-text-muted leading-relaxed">
                We collect basic usage analytics to improve our service, such as which features are used most often and general performance metrics. This data is anonymized and aggregated—we cannot identify individual users from it.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Technical Information</h3>
              <p className="text-text-muted leading-relaxed">
                Like most web services, we automatically collect certain technical information, including IP addresses, browser types, device information, and access times. This helps us provide and improve our service, diagnose problems, and ensure security.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">How We Use Your Information</h2>
            <p className="text-text-muted leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Provide, maintain, and improve our service</li>
              <li>Authenticate your account and secure your data</li>
              <li>Save and retrieve your builds</li>
              <li>Send you important service updates (only when necessary)</li>
              <li>Respond to your support requests</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="text-text-muted leading-relaxed mt-4">
              We do not use your information for advertising, marketing emails (unless you opt in), or selling to third parties. Ever.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Data Sharing and Disclosure</h2>
            <p className="text-text-muted leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li><strong>Service Providers:</strong> We may share data with trusted service providers who assist in operating our service (such as hosting providers), but only to the extent necessary and under strict confidentiality agreements.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation, or to protect our rights, property, or safety.</li>
              <li><strong>With Your Consent:</strong> We may share information if you explicitly consent to such sharing.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Data Security</h2>
            <p className="text-text-muted leading-relaxed">
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Secure authentication systems</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
            </ul>
            <p className="text-text-muted leading-relaxed mt-4">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Your Rights and Choices</h2>
            <p className="text-text-muted leading-relaxed">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li><strong>Access:</strong> You can access all your data through your account settings</li>
              <li><strong>Correction:</strong> You can update your account information at any time</li>
              <li><strong>Deletion:</strong> You can delete your account and all associated data at any time</li>
              <li><strong>Export:</strong> You can export your build data using our export features</li>
              <li><strong>Opt-Out:</strong> You can opt out of non-essential communications</li>
            </ul>
            <p className="text-text-muted leading-relaxed mt-4">
              To exercise these rights, contact us at <a href="mailto:support@zenpc.app" className="text-accent hover:underline">support@zenpc.app</a> or use the account deletion feature in your settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Cookies and Tracking</h2>
            <p className="text-text-muted leading-relaxed">
              We use essential cookies to maintain your session and provide core functionality. We do not use tracking cookies, advertising cookies, or third-party analytics that track you across websites.
            </p>
            <p className="text-text-muted leading-relaxed">
              You can control cookies through your browser settings, though disabling essential cookies may affect your ability to use ZenPC.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Children&apos;s Privacy</h2>
            <p className="text-text-muted leading-relaxed">
              ZenPC is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Changes to This Policy</h2>
            <p className="text-text-muted leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of ZenPC after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Contact Us</h2>
            <p className="text-text-muted leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
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
