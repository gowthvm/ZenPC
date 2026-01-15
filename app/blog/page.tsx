'use client';

import { useEffect, useRef, useState } from 'react';

export default function BlogPage() {
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
      
      <div className="relative z-10 max-w-4xl mx-auto py-20 px-4 min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">ZenPC Blog</h1>
        <p className="text-text-muted mb-8 text-lg">Insights, news, and tips from the ZenPC team.</p>
        <section className="grid gap-8 md:grid-cols-2">
          {/* Example blog posts */}
          <article className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium cursor-pointer">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Building the Ultimate Gaming PC in 2026</h2>
            <p className="text-text-muted mb-4 leading-relaxed">A comprehensive guide to the best components and configurations for a high-end gaming rig this year.</p>
            <a href="#" className="text-accent hover:underline transition-colors duration-base ease-premium">Read more →</a>
          </article>
          <article className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium cursor-pointer">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">How ZenPC Ensures Compatibility</h2>
            <p className="text-text-muted mb-4 leading-relaxed">Learn about our real-time compatibility engine and how it helps you avoid costly mistakes.</p>
            <a href="#" className="text-accent hover:underline transition-colors duration-base ease-premium">Read more →</a>
          </article>
          <article className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium cursor-pointer">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">The Future of PC Building</h2>
            <p className="text-text-muted mb-4 leading-relaxed">Trends and predictions for the next generation of custom PC builds.</p>
            <a href="#" className="text-accent hover:underline transition-colors duration-base ease-premium">Read more →</a>
          </article>
          <article className="card p-6 group hover:scale-[1.04] hover:shadow-2xl hover:bg-surface-2/80 transition-all duration-base ease-premium cursor-pointer">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Meet the ZenPC Team</h2>
            <p className="text-text-muted mb-4 leading-relaxed">Get to know the people behind ZenPC and our mission to empower PC builders.</p>
            <a href="#" className="text-accent hover:underline transition-colors duration-base ease-premium">Read more →</a>
          </article>
        </section>
      </div>
    </main>
  );
}
