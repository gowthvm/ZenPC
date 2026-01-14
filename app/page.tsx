'use client';

import Link from 'next/link';
import { Button } from './components/ui/button';
import { Divider } from './components/ui/divider';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Page() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [displayPosition, setDisplayPosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUser({ email: user.email });
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Observe all sections
    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Smooth movement using lerp
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setDisplayPosition(prev => ({
        x: lerp(prev.x, mousePosition.x, 0.1),
        y: lerp(prev.y, mousePosition.y, 0.1)
      }));
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePosition]);
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-text-primary relative overflow-hidden">
      {/* Minimal background with mouse-following gradient */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-1 via-transparent to-surface-2 opacity-50" />
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(800px circle at ${displayPosition.x}px ${displayPosition.y}px, rgba(99, 112, 241, 0.15), transparent 40%)`,
          }}
        />
      </div>
      
      {/* Content wrapper to ensure content is above the background effect */}
      <div className="relative z-10">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 pt-6 pb-4 flex items-center justify-between gap-8 bg-surface-1/20 backdrop-blur-glass border-b border-border/10 shadow-glass transition-all duration-300">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center font-display text-sm font-bold text-white select-none shadow-lg">Z</div>
            <span className="font-display text-xl font-semibold text-text-primary">ZenPC</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200">Features</Link>
            <Link href="#how-it-works" className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200">How It Works</Link>
            <Link href="#about" className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-8 bg-surface-2/50 rounded-full animate-pulse"></div>
            ) : user ? (
              <>
                <Link href="/app/account" className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200 truncate max-w-32">
                  {user.email}
                </Link>
                <Button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                    window.location.href = '/';
                  }}
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium hover:bg-surface-2/50 transition-all duration-200"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200">Log In</Link>
                <Link href="/register" className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center px-4 md:px-6 pt-24">
        {/* Minimal Hero Section */}
        <section id="hero" className={`w-full max-w-5xl mx-auto text-center space-y-10 pt-32 pb-24 transition-all duration-1000 ${isVisible['hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="space-y-6">
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-text-primary leading-tight">
              Build Your Dream PC
              <br />
              <span className="text-accent">Effortlessly</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
              Professional PC builder with real-time compatibility checking and expert-curated components.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/app" className="px-8 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
              Start Building
            </Link>
            <Link href="/about" className="px-8 py-3 rounded-lg border border-border text-text-primary font-medium hover:border-text-primary transition-all duration-200 hover:bg-surface-2/30">
              Learn More
            </Link>
          </div>
        </section>

        {/* Minimal How It Works */}
        <section id="how-it-works" className={`w-full max-w-6xl mx-auto flex flex-col items-center gap-16 my-20 transition-all duration-1000 ${isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center space-y-3">
            <h2 className="font-display text-4xl font-semibold text-text-primary">How It Works</h2>
            <p className="text-text-muted text-lg">Three simple steps to your perfect build</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="text-center space-y-4 p-8 rounded-lg border border-border/10 hover:border-border/30 transition-colors">
              <div className="h-16 w-16 mx-auto flex items-center justify-center rounded-xl bg-accent/10">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="font-semibold text-xl">Select Components</div>
              <p className="text-text-muted">Choose from our curated selection of compatible components</p>
            </div>
            <div className="text-center space-y-4 p-8 rounded-lg border border-border/10 hover:border-border/30 transition-colors">
              <div className="h-16 w-16 mx-auto flex items-center justify-center rounded-xl bg-accent/10">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="font-semibold text-xl">Check Compatibility</div>
              <p className="text-text-muted">Real-time validation ensures all parts work together</p>
            </div>
            <div className="text-center space-y-4 p-8 rounded-lg border border-border/10 hover:border-border/30 transition-colors">
              <div className="h-16 w-16 mx-auto flex items-center justify-center rounded-xl bg-accent/10">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="font-semibold text-xl">Build & Order</div>
              <p className="text-text-muted">Get your complete build list and order with confidence</p>
            </div>
          </div>
        </section>

        {/* Minimal Features */}
        <section id="features" className={`w-full max-w-7xl mx-auto my-20`}>
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-display text-4xl font-bold text-text-primary">Powerful Features</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">Everything you need to build the perfect PC with confidence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Real-time Pricing</h3>
                </div>
              </div>
              <p className="text-text-muted leading-relaxed">Live price updates from multiple retailers ensure you always get the best deal available.</p>
            </div>
            
            <div className="card p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Smart Compatibility</h3>
                </div>
              </div>
              <p className="text-text-muted leading-relaxed">Advanced algorithms check for compatibility issues before you make any purchase decisions.</p>
            </div>
            
            <div className="card p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Build History</h3>
                </div>
              </div>
              <p className="text-text-muted leading-relaxed">Track and compare all your builds with detailed performance metrics and cost analysis.</p>
            </div>
            
            <div className="card p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Budget Tracking</h3>
                </div>
              </div>
              <p className="text-text-muted leading-relaxed">Stay within budget with real-time cost calculations and intelligent spending alerts.</p>
            </div>
            
            <div className="card p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Build Guides</h3>
                </div>
              </div>
              <p className="text-text-muted leading-relaxed">Step-by-step guides for assembly, cable management, and performance optimization.</p>
            </div>
            
            <div className="card p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Community Builds</h3>
                </div>
              </div>
              <p className="text-text-muted leading-relaxed">Browse and learn from amazing builds shared by our passionate community.</p>
            </div>
          </div>
        </section>

        {/* Minimal CTA Section */}
        <section className="w-full max-w-5xl mx-auto my-20">
          <div className="p-12 rounded-lg border border-border/20 bg-surface-1/30 text-center">
            <h2 className="font-display text-3xl font-semibold text-text-primary mb-4">
              Ready to Build Your Dream PC?
            </h2>
            <p className="text-text-muted text-lg mb-8">
              Join thousands of PC builders who trust ZenPC for their custom builds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app" className="px-8 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                Start Building
              </Link>
              <Link href="/guide" className="px-8 py-3 rounded-lg border border-border text-text-primary font-medium hover:border-text-primary transition-all duration-200 hover:bg-surface-2/30">
                View Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="w-full bg-surface-2/50 border-t border-border/10 mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
                  <span className="font-display font-bold text-white">Z</span>
                </div>
                <h3 className="font-display text-2xl font-bold bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">ZenPC</h3>
              </div>
              <p className="text-text-muted text-sm leading-relaxed">
                Premium PC builder with real-time compatibility checking and expert-curated components.
              </p>
              <div className="flex items-center gap-4 pt-2">
                {['M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10zm-6.5 0l-5-5 1.5-1.5 7 7-7 7-1.5-1.5 5-5z', 
                   'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-12h2v9h-2V5z',
                   'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'
                ].map((d, i) => (
                  <div key={i} className="p-2 rounded-lg hover:bg-surface-3/50 transition-all duration-200 cursor-pointer hover:scale-110">
                    <svg className="w-5 h-5 text-text-muted hover:text-accent transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Columns */}
            {[
              {
                title: 'Product',
                links: [
                  { name: 'PC Builder', href: '/builder' },
                  { name: 'Build Guide', href: '/guide' },
                  { name: 'Community', href: '/community' },
                  { name: 'Pricing', href: '/pricing' },
                  { name: 'Updates', href: '/updates' }
                ]
              },
              {
                title: 'Company',
                links: [
                  { name: 'About Us', href: '/about' },
                  { name: 'Careers', href: '/careers' },
                  { name: 'Blog', href: '/blog' },
                  { name: 'Press', href: '/press' },
                  { name: 'Partners', href: '/partners' }
                ]
              },
              {
                title: 'Support',
                links: [
                  { name: 'Help Center', href: '/help' },
                  { name: 'Contact Us', href: '/contact' },
                  { name: 'Documentation', href: '/docs' },
                  { name: 'Status', href: '/status' },
                  { name: 'Security', href: '/security' }
                ]
              }
            ].map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                  {section.title}
                </h3>
                <nav className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <Link
                      key={linkIdx}
                      href={link.href}
                      className="text-sm text-text-muted hover:text-accent transition-all duration-200 flex items-center group"
                    >
                      <span className="h-0.5 w-0 bg-accent group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-border/10 my-10"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-text-muted/80">
              <span>© {new Date().getFullYear()} ZenPC</span>
              <span className="text-border">•</span>
              <span>All rights reserved</span>
              <span className="text-border">•</span>
              <span>v1.0.0</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-text-muted/80 hover:text-accent transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-text-muted/80 hover:text-accent transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-text-muted/80 hover:text-accent transition-colors duration-200">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {scrollY > 400 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-accent text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        >
          <svg className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      </div>
    </div>
  );
}

