'use client';

import { useEffect, useRef, useState } from 'react';

export default function PricingPage() {
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const [isClient, setIsClient] = useState(false);

  // Smooth cursor effect with requestAnimationFrame
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isClient]);

  return (
    <main className="min-h-dvh bg-bg text-text-primary relative overflow-hidden">
      {/* Purple cursor effect */}
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
      
      <div className="relative z-10 max-w-3xl mx-auto py-20 px-4 min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">Pricing</h1>
        <p className="text-text-muted mb-8 text-lg">Choose the plan that fits your needs. Transparent pricing, no hidden fees.</p>
        <section className="grid md:grid-cols-2 gap-8">
          <div className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Free</h2>
            <p className="text-text-muted mb-4">Basic PC builder access, community forums, and guides.</p>
            <span className="text-lg font-bold text-accent">$0/month</span>
          </div>
          <div className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium border-accent/20">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Pro</h2>
            <p className="text-text-muted mb-4">Advanced compatibility, expert support, and exclusive deals.</p>
            <span className="text-lg font-bold text-accent">$9.99/month</span>
          </div>
        </section>
      </div>
    </main>
  );
}
