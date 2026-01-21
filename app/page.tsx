'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Aurora from '@/components/Aurora';
import { CursorGlow } from '@/components/effects/MagneticElement';
import { Particles } from '@/components/effects/Particles';
import {
  Zap, Shield, BookOpen, Wallet, Users, Lightbulb,
  ArrowRight, ChevronUp, Cpu, Monitor, HardDrive
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }
  }
};

// Feature data
const features = [
  {
    icon: Zap,
    title: 'Real-time Pricing',
    description: 'Live price updates from multiple retailers ensure you always get the best deal available.',
    color: 'from-amber-500/20 to-orange-600/20',
    iconColor: 'text-amber-400'
  },
  {
    icon: Shield,
    title: 'Smart Compatibility',
    description: 'Advanced algorithms check for compatibility issues before you make any purchase decisions.',
    color: 'from-green-500/20 to-emerald-600/20',
    iconColor: 'text-green-400'
  },
  {
    icon: BookOpen,
    title: 'Build History',
    description: 'Track and compare all your builds with detailed performance metrics and cost analysis.',
    color: 'from-blue-500/20 to-cyan-600/20',
    iconColor: 'text-blue-400'
  },
  {
    icon: Wallet,
    title: 'Budget Tracking',
    description: 'Stay within budget with real-time cost calculations and intelligent spending alerts.',
    color: 'from-purple-500/20 to-violet-600/20',
    iconColor: 'text-purple-400'
  },
  {
    icon: Lightbulb,
    title: 'Build Guides',
    description: 'Step-by-step guides for assembly, cable management, and performance optimization.',
    color: 'from-rose-500/20 to-pink-600/20',
    iconColor: 'text-rose-400'
  },
  {
    icon: Users,
    title: 'Community Builds',
    description: 'Browse and learn from amazing builds shared by our passionate community.',
    color: 'from-cyan-500/20 to-teal-600/20',
    iconColor: 'text-cyan-400'
  },
];

// Steps data
const steps = [
  {
    icon: Cpu,
    title: 'Select Components',
    description: 'Choose from our curated selection of compatible components',
    number: '01'
  },
  {
    icon: Shield,
    title: 'Check Compatibility',
    description: 'Real-time validation ensures all parts work together',
    number: '02'
  },
  {
    icon: Monitor,
    title: 'Build & Order',
    description: 'Get your complete build list and order with confidence',
    number: '03'
  },
];

export default function Page() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
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
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-text-primary relative overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0 will-change-transform" style={{ perspective: '1000px' }}>
        <Aurora
          colorStops={["#ffffff", "#594a91", "#ffffff"]}
          blend={0.4}
          amplitude={0.8}
          speed={0.8}
        />
      </div>

      {/* Gradient overlay */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-transparent via-bg/20 to-bg/60 pointer-events-none" />

      {/* Cursor glow effect */}
      <CursorGlow color="rgb(99, 112, 241)" size={500} blur={60} opacity={0.15} />

      {/* Particles (subtle, behind content) */}
      <div className="fixed inset-0 z-[2] pointer-events-none">
        <Particles
          quantity={30}
          color="rgb(99, 112, 241)"
          minSize={1}
          maxSize={2}
          speed={0.3}
          showConnections={false}
          mouseInteract={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-20">
        {/* Header */}
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 w-full px-6 py-4"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-8 px-6 py-3 rounded-2xl bg-surface-1/40 backdrop-blur-xl border border-border/10 shadow-glass">
              <Link href="/" className="flex items-center gap-3 group">
                <motion.div
                  className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center font-display text-sm font-bold text-white select-none shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Z
                </motion.div>
                <span className="font-display text-xl font-semibold text-text-primary">ZenPC</span>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                {['Features', 'How It Works', 'Pricing'].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200 relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                {loading ? (
                  <div className="w-20 h-8 bg-surface-2/50 rounded-full animate-pulse" />
                ) : user ? (
                  <>
                    <Link href="/builder" className="text-sm text-text-muted hover:text-text-primary transition-colors truncate max-w-32">
                      {user.email}
                    </Link>
                    <motion.button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setUser(null);
                        window.location.href = '/';
                      }}
                      className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary border border-border/20 rounded-lg hover:bg-surface-2/50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign Out
                    </motion.button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                      Log In
                    </Link>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/register"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-purple-600 text-white text-sm font-medium shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all"
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        <main className="flex-1 w-full">
          {/* Hero Section */}
          <motion.section
            className="relative min-h-screen flex items-center justify-center px-4"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            <div className="max-w-5xl mx-auto text-center pt-20">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-8"
              >
                {/* Badge */}
                <motion.div variants={fadeInUp} className="flex justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    New: AI-Powered Build Recommendations
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight"
                >
                  <span className="text-text-primary">Build Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-accent via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                    Perfect PC
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={fadeInUp}
                  className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto leading-relaxed"
                >
                  Create a custom PC with our intelligent builder, real-time compatibility checking, and expert recommendations.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                >
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/builder"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all"
                    >
                      Start Building
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/builder?tab=guide"
                      className="inline-flex items-center gap-2 px-8 py-4 border border-border/30 text-text-primary font-semibold rounded-xl hover:bg-surface-1/50 hover:border-border/50 transition-all backdrop-blur-sm"
                    >
                      View Guide
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-wrap justify-center gap-8 pt-12"
                >
                  {[
                    { value: '10K+', label: 'Builds Created' },
                    { value: '500+', label: 'Components' },
                    { value: '99%', label: 'Compatibility' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
                      <div className="text-sm text-text-muted">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-6 h-10 rounded-full border-2 border-border/30 flex items-start justify-center p-2">
                  <motion.div
                    className="w-1 h-2 bg-accent rounded-full"
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* How It Works */}
          <section id="how-it-works" className="py-32 px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.span variants={fadeInUp} className="text-accent font-medium text-sm uppercase tracking-wider">
                  Simple Process
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-text-primary mt-4">
                  How It Works
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-text-muted text-lg mt-4 max-w-2xl mx-auto">
                  Three simple steps to your perfect build
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    variants={scaleIn}
                    className="relative group"
                  >
                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-accent/50 to-transparent" />
                    )}

                    <motion.div
                      className="relative p-8 rounded-2xl bg-surface-1/40 backdrop-blur-xl border border-border/10 text-center transition-all hover:border-accent/30"
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      {/* Number badge */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
                        {step.number}
                      </div>

                      <div className="h-16 w-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <step.icon className="w-8 h-8 text-accent" />
                      </div>

                      <h3 className="font-semibold text-xl text-text-primary mb-3">{step.title}</h3>
                      <p className="text-text-muted">{step.description}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="py-32 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.span variants={fadeInUp} className="text-accent font-medium text-sm uppercase tracking-wider">
                  Everything You Need
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-text-primary mt-4">
                  Powerful Features
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-text-muted text-lg mt-4 max-w-2xl mx-auto">
                  Everything you need to build the perfect PC with confidence
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {features.map((feature) => (
                  <motion.div
                    key={feature.title}
                    variants={scaleIn}
                    className="group cursor-pointer"
                  >
                    <motion.div
                      className="h-full p-8 rounded-2xl bg-surface-1/40 backdrop-blur-xl border border-border/10 transition-all hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                      </div>
                      <h3 className="font-semibold text-xl text-text-primary mb-3">{feature.title}</h3>
                      <p className="text-text-muted leading-relaxed">{feature.description}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-32 px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="max-w-4xl mx-auto"
            >
              <div className="relative p-12 md:p-16 rounded-3xl overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-purple-600/10 to-cyan-600/20 backdrop-blur-xl" />
                <div className="absolute inset-0 bg-surface-1/30" />
                <div className="absolute inset-0 border border-border/20 rounded-3xl" />

                {/* Floating shapes */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl" />

                <div className="relative text-center">
                  <motion.h2
                    className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-6"
                    variants={fadeInUp}
                  >
                    Ready to Build Your
                    <br />
                    <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                      Dream PC?
                    </span>
                  </motion.h2>

                  <motion.p
                    className="text-text-muted text-lg mb-10 max-w-xl mx-auto"
                    variants={fadeInUp}
                  >
                    Join thousands of PC builders who trust ZenPC for their custom builds.
                  </motion.p>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    variants={fadeInUp}
                  >
                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/builder"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-bg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        Start Building
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/builder?tab=guide"
                        className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                      >
                        View Guide
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </section>
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full bg-surface-1/50 backdrop-blur-xl border-t border-border/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Brand */}
              <div className="space-y-6">
                <Link href="/" className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
                    <span className="font-display font-bold text-white">Z</span>
                  </div>
                  <span className="font-display text-2xl font-bold bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
                    ZenPC
                  </span>
                </Link>
                <p className="text-text-muted text-sm leading-relaxed">
                  Premium PC builder with real-time compatibility checking and expert-curated components.
                </p>
              </div>

              {/* Links */}
              {[
                {
                  title: 'Product', links: [
                    { name: 'PC Builder', href: '/builder' },
                    { name: 'Build Guide', href: '/builder?tab=guide' },
                    { name: 'Community', href: '/community' },
                    { name: 'Pricing', href: '/pricing' },
                  ]
                },
                {
                  title: 'Company', links: [
                    { name: 'About Us', href: '/about' },
                    { name: 'Careers', href: '/careers' },
                    { name: 'Blog', href: '/blog' },
                    { name: 'Press', href: '/press' },
                  ]
                },
                {
                  title: 'Support', links: [
                    { name: 'Help Center', href: '/help' },
                    { name: 'Contact Us', href: '/contact' },
                    { name: 'Documentation', href: '/docs' },
                    { name: 'Status', href: '/status' },
                  ]
                },
              ].map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <nav className="space-y-3">
                    {section.links.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="text-sm text-text-muted hover:text-accent transition-colors flex items-center group"
                      >
                        <span className="h-0.5 w-0 bg-accent group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300" />
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            <div className="border-t border-border/10 mt-12 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-2 text-text-muted/80">
                  <span>© {new Date().getFullYear()} ZenPC</span>
                  <span className="text-border">•</span>
                  <span>All rights reserved</span>
                </div>
                <div className="flex items-center gap-6">
                  {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item) => (
                    <Link
                      key={item}
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="text-text-muted/80 hover:text-accent transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Back to top */}
        <BackToTop />
      </div>
    </div>
  );
}

// Back to top button component
function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-accent text-white shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
