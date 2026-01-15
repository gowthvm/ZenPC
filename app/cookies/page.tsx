'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function CookiesPage() {
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
              Cookies Policy
            </h1>
            <p className="text-text-muted text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">What Are Cookies?</h2>
            <p className="text-text-muted leading-relaxed">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-text-muted leading-relaxed">
              Cookies allow websites to remember your preferences, maintain your session, and improve your browsing experience. They can be &quot;session cookies&quot; (temporary, deleted when you close your browser) or &quot;persistent cookies&quot; (remain on your device until they expire or are deleted).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">How ZenPC Uses Cookies</h2>
            <p className="text-text-muted leading-relaxed">
              ZenPC uses cookies minimally and transparently. We only use cookies that are essential for the service to function properly. We do not use tracking cookies, advertising cookies, or third-party analytics cookies that follow you across websites.
            </p>
            
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Essential Cookies</h3>
                <p className="text-text-muted leading-relaxed mb-3">
                  These cookies are necessary for ZenPC to function and cannot be disabled. They include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                  <li><strong>Authentication cookies:</strong> Maintain your login session so you don&apos;t have to sign in repeatedly</li>
                  <li><strong>Security cookies:</strong> Help protect against unauthorized access and maintain account security</li>
                  <li><strong>Preference cookies:</strong> Remember your settings and preferences (like theme or language)</li>
                  <li><strong>Build data cookies:</strong> Temporarily store your build progress if you&apos;re not logged in</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Cookies We Don&apos;t Use</h2>
            <p className="text-text-muted leading-relaxed">
              To protect your privacy, ZenPC does not use:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Tracking cookies that follow you across websites</li>
              <li>Advertising cookies for targeted ads</li>
              <li>Third-party analytics cookies (like Google Analytics)</li>
              <li>Social media tracking pixels</li>
              <li>Retargeting or remarketing cookies</li>
            </ul>
            <p className="text-text-muted leading-relaxed mt-4">
              We believe in privacy by design, which means we don't collect data we don't need and we don't use cookies for purposes beyond providing our core service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Managing Cookies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Browser Settings</h3>
                <p className="text-text-muted leading-relaxed">
                  Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies, delete cookies, or notify you when cookies are being set. However, disabling essential cookies may affect your ability to use ZenPC.
                </p>
                <p className="text-text-muted leading-relaxed mt-2">
                  Here's how to manage cookies in popular browsers:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-muted ml-4 mt-2">
                  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Impact of Disabling Cookies</h3>
                <p className="text-text-muted leading-relaxed">
                  If you disable essential cookies, some features of ZenPC may not work properly:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                  <li>You may need to sign in repeatedly</li>
                  <li>Your build progress may not be saved if you're not logged in</li>
                  <li>Your preferences and settings may not be remembered</li>
                  <li>Some security features may not function correctly</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Third-Party Cookies</h2>
            <p className="text-text-muted leading-relaxed">
              ZenPC does not use third-party cookies. We don't embed third-party services that set their own cookies, and we don't use advertising networks or social media plugins that would place tracking cookies on your device.
            </p>
            <p className="text-text-muted leading-relaxed">
              The only exception would be if we were to integrate with a payment processor in the future, which would require cookies for secure transaction processing. In such cases, we would clearly disclose this and provide information about the third party's cookie practices.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Local Storage</h2>
            <p className="text-text-muted leading-relaxed">
              In addition to cookies, ZenPC may use browser local storage to temporarily store your build data and preferences. This data is stored locally on your device and is not transmitted to our servers unless you're logged in and choose to save your build.
            </p>
            <p className="text-text-muted leading-relaxed">
              You can clear local storage through your browser settings, similar to clearing cookies. This will remove any locally stored build data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Updates to This Policy</h2>
            <p className="text-text-muted leading-relaxed">
              We may update this Cookies Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Questions About Cookies?</h2>
            <p className="text-text-muted leading-relaxed">
              If you have questions about how we use cookies, please contact us at <a href="mailto:support@zenpc.app" className="text-accent hover:underline">support@zenpc.app</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
