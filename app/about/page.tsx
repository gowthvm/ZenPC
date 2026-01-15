'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
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

        <div className="space-y-12">
          {/* Hero Section */}
          <div className="card p-8 md:p-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
              About ZenPC
            </h1>
            <p className="text-xl text-text-muted leading-relaxed mb-6">
              ZenPC was born from a simple frustration: building a custom PC shouldn&apos;t require a computer science degree or hours of research across dozens of websites.
            </p>
            <p className="text-lg text-text-primary leading-relaxed">
              We believe that everyone—from first-time builders to seasoned enthusiasts—deserves access to tools that make PC building clear, trustworthy, and genuinely helpful. No marketing fluff, no fake urgency, no confusing jargon.
            </p>
          </div>

          {/* Our Mission */}
          <div className="card p-8 md:p-12">
            <h2 className="font-display text-3xl font-semibold mb-6 text-text-primary">Our Mission</h2>
            <div className="space-y-4 text-text-primary leading-relaxed">
              <p>
                To democratize PC building by providing the most accurate, user-friendly, and transparent tools available. We&apos;re not here to sell you anything—we&apos;re here to empower you to make informed decisions.
              </p>
              <p>
                Every feature we build, every compatibility check we run, and every piece of guidance we offer is designed with one goal: to help you build a PC that meets your needs, fits your budget, and brings you genuine satisfaction.
              </p>
              <p>
                We&apos;re committed to maintaining a calm, educational environment where you can learn at your own pace, experiment without fear, and build with confidence.
              </p>
            </div>
          </div>

          {/* Our Philosophy */}
          <div className="card p-8 md:p-12">
            <h2 className="font-display text-3xl font-semibold mb-6 text-text-primary">Our Philosophy</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-text-primary">Transparency First</h3>
                <p className="text-text-muted leading-relaxed">
                  We show you exactly how compatibility checks work, what our recommendations are based on, and why certain parts work together. No black boxes, no mysterious algorithms—just clear, explainable logic you can understand and trust.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-text-primary">Education Over Sales</h3>
                <p className="text-text-muted leading-relaxed">
                  We&apos;d rather teach you why a 750W PSU might be better for your build than simply recommend the most expensive option. Understanding the &quot;why&quot; helps you make better decisions now and in the future.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-text-primary">Respect for Your Time</h3>
                <p className="text-text-muted leading-relaxed">
                  PC building can be overwhelming. We&apos;ve designed ZenPC to give you the information you need, when you need it, without overwhelming you with options or pushing you toward decisions you&apos;re not ready to make.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-text-primary">Privacy by Design</h3>
                <p className="text-text-muted leading-relaxed">
                  Your builds are yours. We don&apos;t sell your data, we don&apos;t track you across the web, and we don&apos;t require unnecessary personal information. Use ZenPC with confidence that your privacy is protected.
                </p>
              </div>
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="card p-8 md:p-12">
            <h2 className="font-display text-3xl font-semibold mb-6 text-text-primary">What Makes Us Different</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-text-primary">Spec-Driven Architecture</h3>
                <p className="text-text-muted leading-relaxed mb-3">
                  Unlike traditional PC builders that hardcode compatibility rules, ZenPC uses a flexible, spec-driven system. This means:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                  <li>New parts and specifications are automatically supported</li>
                  <li>Compatibility checks are based on actual technical specifications, not assumptions</li>
                  <li>The system scales effortlessly as new technologies emerge</li>
                  <li>You get accurate, up-to-date information without waiting for manual updates</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-text-primary">Real-Time Intelligence</h3>
                <p className="text-text-muted leading-relaxed">
                  Our Build Health and Bottleneck Analysis systems evaluate your build using actual specifications, not generic rules. Every recommendation is tailored to your specific component selection, use case, and performance goals.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-text-primary">No Fear-Based Marketing</h3>
                <p className="text-text-muted leading-relaxed">
                  We won&apos;t tell you your build will explode if you don&apos;t buy a specific component. We provide honest, educational feedback that helps you understand trade-offs and make informed choices. Calm, clear, and helpful—always.
                </p>
              </div>
            </div>
          </div>

          {/* The Team */}
          <div className="card p-8 md:p-12">
            <h2 className="font-display text-3xl font-semibold mb-6 text-text-primary">Built by Builders, for Builders</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              ZenPC is created by a team of PC enthusiasts who&apos;ve experienced the same frustrations you have. We&apos;ve spent countless hours researching parts, troubleshooting compatibility issues, and helping friends build their first PCs.
            </p>
            <p className="text-text-muted leading-relaxed">
              That experience drives everything we do. We know what it&apos;s like to discover a socket mismatch after ordering parts. We understand the anxiety of wondering if your PSU is powerful enough. We&apos;ve felt the satisfaction of a perfectly balanced build.
            </p>
            <p className="text-text-muted leading-relaxed mt-4">
              Our goal is to share that knowledge and make PC building accessible to everyone, regardless of experience level.
            </p>
          </div>

          {/* Looking Forward */}
          <div className="card p-8 md:p-12">
            <h2 className="font-display text-3xl font-semibold mb-6 text-text-primary">Looking Forward</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              ZenPC is continuously evolving. We&apos;re working on advanced features like AI-powered recommendations, automated build optimization, and deeper integration with retailer pricing APIs.
            </p>
            <p className="text-text-muted leading-relaxed">
              But our core mission remains unchanged: to provide the most trustworthy, educational, and user-friendly PC building experience available. Every feature we add, every improvement we make, is guided by that principle.
            </p>
          </div>

          {/* Contact */}
          <div className="card p-8 md:p-12 bg-accent/5 border-accent/20">
            <h2 className="font-display text-3xl font-semibold mb-4 text-text-primary">Get in Touch</h2>
            <p className="text-text-muted leading-relaxed mb-6">
              Have questions, suggestions, or feedback? We&apos;d love to hear from you. Your input helps us make ZenPC better for everyone.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Contact Us
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
