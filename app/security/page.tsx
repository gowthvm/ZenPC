'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function SecurityPage() {
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
              Security
            </h1>
            <p className="text-xl text-text-muted leading-relaxed">
              Your security and privacy are fundamental to ZenPC. We implement industry-standard security measures and follow security best practices to protect your data.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Data Encryption</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Encryption in Transit</h3>
                <p className="text-text-muted leading-relaxed">
                  All data transmitted between your device and our servers is encrypted using TLS 1.3, the latest and most secure encryption protocol. This ensures that your information cannot be intercepted or read by third parties during transmission.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Encryption at Rest</h3>
                <p className="text-text-muted leading-relaxed">
                  Sensitive data stored in our databases is encrypted at rest using industry-standard encryption algorithms. This means your data is protected even if our storage systems were compromised.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Authentication & Access Control</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Secure Authentication</h3>
                <p className="text-text-muted leading-relaxed">
                  We use industry-standard authentication systems with secure password hashing (bcrypt) and support for secure authentication methods. Passwords are never stored in plain text and cannot be recovered by our team.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Row-Level Security</h3>
                <p className="text-text-muted leading-relaxed">
                  Our database implements row-level security policies that ensure users can only access their own data. Even if there were a database breach, your data would remain protected from unauthorized access.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Session Management</h3>
                <p className="text-text-muted leading-relaxed">
                  User sessions are managed securely with automatic expiration and secure token handling. Sessions are invalidated on logout and can be revoked remotely if suspicious activity is detected.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Infrastructure Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Hosting & Infrastructure</h3>
                <p className="text-text-muted leading-relaxed">
                  ZenPC is hosted on secure, enterprise-grade infrastructure with regular security updates, intrusion detection, and monitoring. Our hosting provider maintains SOC 2 Type II compliance and implements comprehensive security controls.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Regular Security Audits</h3>
                <p className="text-text-muted leading-relaxed">
                  We conduct regular security audits of our codebase, infrastructure, and third-party dependencies. We stay updated on security advisories and promptly apply patches and updates.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Dependency Management</h3>
                <p className="text-text-muted leading-relaxed">
                  We regularly update all dependencies and monitor for security vulnerabilities. Automated tools scan our codebase for known vulnerabilities, and we address issues promptly.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Privacy Protection</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Data Minimization</h3>
                <p className="text-text-muted leading-relaxed">
                  We collect only the data necessary to provide our service. We don&apos;t collect unnecessary personal information, and we don&apos;t track you across other websites or services.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">No Data Selling</h3>
                <p className="text-text-muted leading-relaxed">
                  We never sell your data to third parties. Your information is used solely to provide and improve ZenPC. This is a core principle we will never compromise on.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">User Control</h3>
                <p className="text-text-muted leading-relaxed">
                  You have full control over your data. You can access, export, or delete your data at any time through your account settings. Deletion is permanent and immediate.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Responsible Disclosure</h2>
            <p className="text-text-muted leading-relaxed">
              We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Email security concerns to <a href="mailto:security@zenpc.app" className="text-accent hover:underline">security@zenpc.app</a></li>
              <li>Provide detailed information about the vulnerability</li>
              <li>Allow us time to address the issue before public disclosure</li>
              <li>Avoid accessing or modifying data that isn't yours</li>
            </ul>
            <p className="text-text-muted leading-relaxed mt-4">
              We appreciate responsible disclosure and will work with security researchers to address issues promptly. We may acknowledge responsible disclosures (with your permission) but will never pursue legal action against researchers acting in good faith.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Security Best Practices for Users</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Strong Passwords</h3>
                <p className="text-text-muted leading-relaxed">
                  Use a strong, unique password for your ZenPC account. Consider using a password manager to generate and store secure passwords.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Account Security</h3>
                <p className="text-text-muted leading-relaxed">
                  Never share your account credentials with anyone. If you suspect unauthorized access, change your password immediately and contact support.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Keep Software Updated</h3>
                <p className="text-text-muted leading-relaxed">
                  Keep your browser and operating system updated to ensure you have the latest security patches. This protects you from known vulnerabilities.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Incident Response</h2>
            <p className="text-text-muted leading-relaxed">
              In the unlikely event of a security incident, we have procedures in place to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Immediately assess and contain the incident</li>
              <li>Notify affected users promptly</li>
              <li>Work with security experts to remediate issues</li>
              <li>Conduct post-incident analysis to prevent future occurrences</li>
              <li>Provide transparent communication about what happened and what we&apos;re doing about it</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Compliance & Certifications</h2>
            <p className="text-text-muted leading-relaxed">
              While we're a smaller service, we follow security best practices aligned with industry standards. Our infrastructure provider maintains SOC 2 Type II compliance, and we implement security controls consistent with GDPR principles, even if not formally certified.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Questions About Security?</h2>
            <p className="text-text-muted leading-relaxed">
              If you have questions about our security practices or want to report a security concern, please contact us at <a href="mailto:security@zenpc.app" className="text-accent hover:underline">security@zenpc.app</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
