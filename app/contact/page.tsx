'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to your backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card p-8">
              <h1 className="font-display text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
                Get in Touch
              </h1>
              <p className="text-lg text-text-muted leading-relaxed mb-8">
                Have questions, feedback, or need support? We&apos;re here to help. Our team typically responds within 1-2 business days.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wider">Email</h3>
                  <a 
                    href="mailto:support@zenpc.app" 
                    className="text-accent hover:underline transition-colors"
                  >
                    support@zenpc.app
                  </a>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wider">Response Time</h3>
                  <p className="text-text-muted">
                    We aim to respond to all inquiries within 1-2 business days. For urgent technical issues, please include &quot;URGENT&quot; in your subject line.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wider">What We Can Help With</h3>
                  <ul className="space-y-2 text-text-muted">
                    <li>• Technical support and troubleshooting</li>
                    <li>• Compatibility questions and clarifications</li>
                    <li>• Feature requests and suggestions</li>
                    <li>• Bug reports and accuracy issues</li>
                    <li>• Account and data management</li>
                    <li>• Partnership and business inquiries</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card p-8 bg-accent/5 border-accent/20">
              <h3 className="text-xl font-semibold mb-4 text-text-primary">Before You Contact Us</h3>
              <p className="text-text-muted leading-relaxed mb-4">
                Many questions are answered in our <Link href="/help" className="text-accent hover:underline">Help Center</Link>. Check there first for faster answers.
              </p>
              <p className="text-text-muted leading-relaxed">
                For compatibility questions, please include specific parts involved and any error messages you&apos;re seeing. This helps us provide accurate, helpful responses.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6 text-text-primary">Send Us a Message</h2>
            
            {submitted ? (
              <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-green-400 font-medium mb-2">Message Sent!</p>
                <p className="text-text-muted text-sm">
                  Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-surface-1/50 border border-border/20 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-surface-1/50 border border-border/20 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-surface-1/50 border border-border/20 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-surface-1/50 border border-border/20 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
