'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Aurora from '@/components/Aurora';
import { CursorGlow } from '@/components/effects/MagneticElement';
import PCVisualizer3D from '@/components/PCVisualizer3D';
import PCVisualizer3DAdvanced from '@/components/PCVisualizer3DAdvanced';
import {
  Zap, Shield, BookOpen, Wallet, Users, Lightbulb,
  ArrowRight, ChevronUp, Cpu, Monitor, HardDrive, Sparkles, 
  TrendingUp, Layers, Gauge, Flame, CheckCircle2, Star, Play,
  Rocket, Target, Trophy, Zap as Lightning, Code, Gamepad2, BarChart3, 
  TrendingDown, Workflow, Eye, Wand2, AlertCircle, Heart, Download, Share2
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const }
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
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const }
  }
};

// Feature data - UPGRADED with more powerful, specific benefits
const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Recommendations',
    description: 'Get intelligent component suggestions based on your budget and use case. Our ML model learns from 10,000+ successful builds.',
    color: 'from-amber-500/20 to-orange-600/20',
    iconColor: 'text-amber-400',
    badge: 'NEW',
    stats: '92% match rate'
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Price Tracking',
    description: 'Automatically find the lowest prices across 50+ retailers. Get instant alerts when deals drop on your wishlist.',
    color: 'from-green-500/20 to-emerald-600/20',
    iconColor: 'text-green-400',
    stats: '$600 avg savings'
  },
  {
    icon: Shield,
    title: 'Guarantee Compatibility',
    description: '100% compatibility verification. We check power supply, motherboard slots, RAM support, and thermal clearance automatically.',
    color: 'from-blue-500/20 to-cyan-600/20',
    iconColor: 'text-blue-400',
    stats: '100% guaranteed'
  },
  {
    icon: Gauge,
    title: 'Performance Estimates',
    description: 'Preview expected gaming FPS, 3D rendering performance, and workload benchmarks before buying anything.',
    color: 'from-purple-500/20 to-violet-600/20',
    iconColor: 'text-purple-400',
    stats: 'Real benchmarks'
  },
  {
    icon: Layers,
    title: 'Visual Build Planning',
    description: '3D component preview shows exactly how everything looks together. Check airflow, aesthetics, and cable routing beforehand.',
    color: 'from-rose-500/20 to-pink-600/20',
    iconColor: 'text-rose-400',
    stats: '360° preview'
  },
  {
    icon: Users,
    title: 'Expert Community',
    description: 'Learn from 15,000+ vetted builds. Compare specs, ask questions, and get real-world performance data from actual users.',
    color: 'from-cyan-500/20 to-teal-600/20',
    iconColor: 'text-cyan-400',
    stats: '50K+ members'
  },
];

// New comparison presets
const comparisonPresets = [
  { name: 'Budget Gaming', price: '$800', fps: '100+ FPS', game: '1080p High' },
  { name: 'Competitive Esports', price: '$1,500', fps: '240+ FPS', game: '1080p Ultra' },
  { name: '4K Ultra', price: '$3,500', fps: '120+ FPS', game: '4K High' },
  { name: 'Streaming Setup', price: '$2,200', fps: '144+ FPS', game: 'Multitask' },
  { name: '3D Workstation', price: '$4,000', fps: 'Professional', game: 'Rendering' },
];

// New performance tiers
const performanceTiers = [
  { tier: 'Entry', color: 'from-blue-500/30 to-blue-600/30', games: ['Minecraft', 'Valorant', 'CSGO'], fps: '144+' },
  { tier: 'Mid Range', color: 'from-purple-500/30 to-purple-600/30', games: ['Fortnite', 'Warzone', 'Elden Ring'], fps: '100+' },
  { tier: 'High End', color: 'from-pink-500/30 to-pink-600/30', games: ['Cyberpunk', 'Starfield', 'Alan Wake 2'], fps: '60+' },
  { tier: 'Extreme', color: 'from-amber-500/30 to-amber-600/30', games: ['4K Gaming', 'Streaming', 'Content Creation'], fps: '120+' },
];

// Gamification badges
const badges = [
  { icon: Trophy, title: 'Build Master', description: 'Created 5+ builds', color: 'text-yellow-400' },
  { icon: Rocket, title: 'Performance Expert', description: 'Optimized 3+ high-end builds', color: 'text-purple-400' },
  { icon: Target, title: 'Budget Pro', description: 'Found best deals consistently', color: 'text-green-400' },
  { icon: Heart, title: 'Community Helper', description: 'Helped 10+ people', color: 'text-rose-400' },
];

// Steps data - More compelling
const steps = [
  {
    icon: Sparkles,
    title: 'Describe Your Vision',
    description: 'Tell us your budget, use case (gaming, streaming, 3D work), and preferences',
    number: '01'
  },
  {
    icon: Zap,
    title: 'Get AI-Optimized Build',
    description: 'Receive an intelligently curated build with best price-to-performance ratio',
    number: '02'
  },
  {
    icon: CheckCircle2,
    title: 'Order with Confidence',
    description: 'One-click purchasing, guaranteed compatibility, and expert support included',
    number: '03'
  },
];

export default function Page() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(0);
  const [comparisonIndex, setComparisonIndex] = useState(0);
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

      {/* Cursor glow effect (subtle) */}
      <CursorGlow color="rgb(100, 108, 225)" size={400} blur={80} opacity={0.08} />

      {/* Content */}
      <div className="relative z-20">
        {/* Header */}
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 w-full px-6 py-4"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const }}
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
          {/* HERO SECTION - ULTRA PREMIUM REDESIGN */}
          <motion.section
            className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 -z-10">
              <motion.div
                animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute top-20 left-10 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
              />
              <motion.div
                animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
                transition={{ duration: 18, repeat: Infinity }}
                className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl -translate-x-1/2 -translate-y-1/2"
              />
            </div>

            <div className="max-w-7xl mx-auto w-full pt-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
                {/* Left Content */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="space-y-8"
                >
                  {/* Dynamic badge with live stats */}
                  <motion.div variants={fadeInUp} className="inline-flex gap-2">
                    <motion.span 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                        <Flame className="w-4 h-4" />
                      </motion.span>
                      TRENDING: 50K+ builds created
                    </motion.span>
                  </motion.div>

                  {/* Revolutionary headline */}
                  <motion.div variants={fadeInUp} className="space-y-4">
                    <h1 className="text-7xl md:text-8xl xl:text-9xl font-display font-black leading-tight">
                      <span className="text-text-primary">Build</span>
                      <br />
                      <motion.span 
                        className="bg-gradient-to-r from-accent via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-size-200 animate-pulse"
                        animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                        transition={{ duration: 5, repeat: Infinity }}
                      >
                        Faster Than Ever
                      </motion.span>
                    </h1>
                  </motion.div>

                  {/* Compelling subheading */}
                  <motion.p
                    variants={fadeInUp}
                    className="text-xl md:text-2xl text-text-muted max-w-2xl leading-relaxed"
                  >
                    AI-powered builds in 60 seconds. Real-time price matching. 100% compatible. Ranked #1 by 50K+ builders.
                  </motion.p>

                  {/* Three-tier trust indicators */}
                  <motion.div variants={fadeInUp} className="space-y-3 pt-4">
                    {[
                      { icon: CheckCircle2, text: '100% Compatibility Guarantee', stat: '0 failures' },
                      { icon: TrendingDown, text: 'Save Hundreds on Components', stat: '$600 avg' },
                      { icon: Zap, text: 'Performance-Optimized Instantly', stat: '+40% speed' }
                    ].map((item, i) => (
                      <motion.div 
                        key={item.text} 
                        className="flex items-center gap-3 p-2"
                        variants={fadeInUp}
                      >
                        <item.icon className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-sm text-text-muted font-medium">{item.text}</span>
                        <span className="ml-auto text-xs text-accent font-bold">{item.stat}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Dual CTA with visual hierarchy */}
                  <motion.div
                    variants={fadeInUp}
                    className="flex flex-col sm:flex-row gap-4 pt-8"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.08, y: -4 }} 
                      whileTap={{ scale: 0.96 }}
                      className="flex-1 sm:flex-none"
                    >
                      <Link
                        href="/builder"
                        className="inline-flex items-center justify-center gap-3 w-full px-8 py-5 bg-gradient-to-r from-accent via-purple-500 to-accent text-white font-bold text-lg rounded-xl shadow-2xl shadow-accent/40 hover:shadow-3xl hover:shadow-accent/50 transition-all border border-accent/50"
                      >
                        <Rocket className="w-5 h-5" />
                        Build Now
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 sm:flex-none"
                    >
                      <button className="inline-flex items-center justify-center gap-2 w-full px-8 py-5 border-2 border-accent/50 text-white font-bold text-lg rounded-xl hover:bg-accent/10 hover:border-accent/80 transition-all backdrop-blur-sm">
                        <Eye className="w-5 h-5" />
                        Watch 90s Demo
                      </button>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced social proof with animated counters */}
                  <motion.div variants={fadeInUp} className="pt-12 border-t border-accent/20 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-600 border-3 border-bg flex items-center justify-center text-xs font-bold text-white shadow-lg"
                          >
                            {String.fromCharCode(65 + i)}
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-text-primary">50,000+ builders trust us</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-accent font-semibold">⭐ 4.9/5 rating</span>
                          <span className="text-text-muted">2.5M builds analyzed</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Side - INTERACTIVE SHOWCASE */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="relative rounded-3xl overflow-hidden group">
                    {/* Premium gradient backgrounds */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-purple-500/20 to-cyan-400/20 rounded-3xl" />
                    <div className="absolute inset-0 backdrop-blur-lg" />
                    
                    {/* Main card */}
                    <div className="relative p-8 md:p-12 rounded-3xl border border-accent/30 bg-surface-1/40">
                      <div className="space-y-8">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-black text-accent uppercase tracking-widest">AI-Optimized Build</p>
                            <h3 className="text-2xl font-bold text-text-primary mt-2">Gaming Powerhouse</h3>
                          </div>
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            className="w-12 h-12 rounded-full bg-gradient-to-r from-accent to-purple-600 flex items-center justify-center"
                          >
                            <Sparkles className="w-6 h-6 text-white" />
                          </motion.div>
                        </div>

                        {/* Component showcase */}
                        <div className="space-y-3">
                          {[
                            { name: 'RTX 4070 Ti', price: '$749', icon: '🎮' },
                            { name: 'Intel i9-13900K', price: '$589', icon: '⚡' },
                            { name: '32GB DDR5 RAM', price: '$189', icon: '🚀' },
                            { name: '2TB NVMe SSD', price: '$159', icon: '💾' }
                          ].map((item, i) => (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.12 }}
                              className="group/item flex items-center justify-between p-4 rounded-lg bg-surface-2/60 border border-accent/20 hover:border-accent/60 hover:bg-surface-2/80 transition-all cursor-pointer"
                              whileHover={{ scale: 1.03, x: 8 }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                  <p className="font-semibold text-text-primary">{item.name}</p>
                                  <p className="text-xs text-text-muted">In stock</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-accent">{item.price}</p>
                                <motion.div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                  <ArrowRight className="w-4 h-4 text-accent" />
                                </motion.div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Stats section */}
                        <div className="grid grid-cols-3 gap-3 pt-8 border-t border-accent/10">
                          <motion.div 
                            className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 text-center"
                            whileHover={{ scale: 1.08, y: -4 }}
                          >
                            <p className="text-xs text-text-muted uppercase font-bold tracking-wider">FPS</p>
                            <p className="text-2xl font-black text-cyan-400 mt-1">240+</p>
                          </motion.div>
                          <motion.div 
                            className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-emerald-500/30 text-center"
                            whileHover={{ scale: 1.08, y: -4 }}
                          >
                            <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Price</p>
                            <p className="text-2xl font-black text-green-400 mt-1">$2,199</p>
                          </motion.div>
                          <motion.div 
                            className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-pink-500/30 text-center"
                            whileHover={{ scale: 1.08, y: -4 }}
                          >
                            <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Score</p>
                            <p className="text-2xl font-black text-pink-400 mt-1">9.2/10</p>
                          </motion.div>
                        </div>
                      </div>

                      {/* Floating animated elements */}
                      <motion.div
                        animate={{ y: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent/20 blur-3xl pointer-events-none"
                      />
                      <motion.div
                        animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute -bottom-40 -left-40 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"
                      />
                    </div>

                    {/* Glow effect on hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent/10 via-purple-500/10 to-cyan-400/10 blur-2xl -z-10 group-hover:blur-3xl transition-all"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Scroll indicator */}
              <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Scroll to explore</span>
                  <div className="w-6 h-10 rounded-full border-2 border-accent/50 flex items-start justify-center p-2">
                    <motion.div
                      className="w-1.5 h-2.5 bg-accent rounded-full"
                      animate={{ y: [0, 12, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* LIVE STATS TICKER - NEW */}
          <section className="py-16 px-4 bg-gradient-to-r from-accent/10 via-purple-500/10 to-cyan-400/10 border-y border-accent/20 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-7xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center">
                {[
                  { label: 'Builds Created', value: '2.5M+', icon: '🔨' },
                  { label: 'Community Members', value: '50K+', icon: '👥' },
                  { label: 'Money Saved', value: '$150M+', icon: '💰' },
                  { label: 'Compatible Combos', value: '1M+', icon: '✅' },
                  { label: 'Retailers Tracked', value: '50+', icon: '🛒' },
                ].map((stat) => (
                  <motion.div key={stat.label} variants={fadeInUp}>
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <motion.p 
                      className="text-4xl font-black text-accent"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-sm text-text-muted mt-2">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* How It Works - UPGRADED */}
          <section id="how-it-works" className="py-32 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-20"
              >
                <motion.span variants={fadeInUp} className="text-accent font-medium text-sm uppercase tracking-wider">
                  🚀 Instant Results
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-display text-5xl md:text-6xl font-bold text-text-primary mt-4">
                  Get Your Build in 3 Minutes
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-text-muted text-xl mt-6 max-w-2xl mx-auto">
                  No need to spend hours researching. Our AI handles it all.
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6"
              >
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    variants={scaleIn}
                    className="relative group"
                  >
                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-20 left-1/2 w-full h-1 bg-gradient-to-r from-accent/50 via-accent/30 to-transparent" style={{ width: 'calc(100% + 32px)', left: '50%', transform: 'translateX(0)' }} />
                    )}

                    <motion.div
                      className="relative p-10 rounded-2xl bg-gradient-to-br from-surface-1/60 to-surface-2/30 backdrop-blur-xl border border-border/20 text-center transition-all hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10"
                      whileHover={{ y: -12, scale: 1.02 }}
                    >
                      {/* Number badge */}
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-accent to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                        {step.number}
                      </div>

                      <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/30 to-purple-600/30 flex items-center justify-center group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-accent/20">
                        <step.icon className="w-10 h-10 text-accent" />
                      </div>

                      <h3 className="font-semibold text-2xl text-text-primary mb-3">{step.title}</h3>
                      <p className="text-text-muted text-base leading-relaxed">{step.description}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Features Grid - COMPLETELY REDESIGNED */}
          <section id="features" className="py-32 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-20"
              >
                <motion.span variants={fadeInUp} className="text-accent font-medium text-sm uppercase tracking-wider">
                  ⚡ Game-Changing Features
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-display text-5xl md:text-6xl font-bold text-text-primary mt-4">
                  Everything Pro Builders Use
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-text-muted text-xl mt-6 max-w-3xl mx-auto">
                  Purpose-built tools that save you time, money, and headaches. From AI recommendations to price tracking to guaranteed compatibility.
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {features.map((feature) => (
                  <motion.div
                    key={feature.title}
                    variants={scaleIn}
                    className="group cursor-pointer h-full"
                  >
                    <motion.div
                      className="h-full p-10 rounded-2xl bg-gradient-to-br from-surface-1/60 to-surface-2/20 backdrop-blur-xl border border-border/20 transition-all hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 flex flex-col"
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      {/* Badge */}
                      {feature.badge && (
                        <div className="inline-flex w-fit mb-4">
                          <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider">
                            {feature.badge}
                          </span>
                        </div>
                      )}

                      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-accent/20`}>
                        <feature.icon className={`w-9 h-9 ${feature.iconColor}`} />
                      </div>
                      
                      <h3 className="font-bold text-2xl text-text-primary mb-3 leading-tight">{feature.title}</h3>
                      <p className="text-text-muted leading-relaxed flex-grow">{feature.description}</p>
                      
                      {/* Add stats */}
                      <div className="mt-6 pt-6 border-t border-border/10">
                        <p className="text-sm font-bold text-accent">{feature.stats}</p>
                      </div>
                      
                      <motion.div 
                        className="mt-4 flex items-center gap-2 text-accent font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <span>Learn more</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* PERFORMANCE TIERS SECTION - NEW */}
          <section className="py-32 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-20"
              >
                <motion.span variants={fadeInUp} className="text-accent font-medium text-sm uppercase tracking-wider">
                  🎮 Performance Tiers
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-display text-5xl md:text-6xl font-bold text-text-primary mt-4">
                  Find Your Perfect Tier
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-text-muted text-xl mt-6 max-w-2xl mx-auto">
                  From competitive esports to professional content creation, we have the perfect build.
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {performanceTiers.map((tier, idx) => (
                  <motion.div
                    key={tier.tier}
                    variants={scaleIn}
                    className="group"
                    onMouseEnter={() => setSelectedTier(idx)}
                  >
                    <motion.div
                      className={`h-full p-8 rounded-2xl bg-gradient-to-br ${tier.color} backdrop-blur-xl border border-accent/20 hover:border-accent/60 transition-all cursor-pointer flex flex-col`}
                      whileHover={{ y: -12, scale: 1.05 }}
                    >
                      <h3 className="font-bold text-2xl text-text-primary mb-6">{tier.tier}</h3>
                      
                      <div className="flex-grow">
                        <div className="mb-6">
                          <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-3">Top Games</p>
                          <div className="space-y-2">
                            {tier.games.map((game) => (
                              <motion.div 
                                key={game}
                                className="flex items-center gap-2 text-sm text-text-muted"
                                whileHover={{ x: 8 }}
                              >
                                <Gamepad2 className="w-4 h-4 text-accent" />
                                {game}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-accent/10 flex items-center justify-between">
                        <span className="font-bold text-text-primary">{tier.fps}</span>
                        <ArrowRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* BUILD COMPARATOR SECTION - NEW */}
          <section className="py-32 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-accent/10 pointer-events-none" />
            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-20"
              >
                <motion.span variants={fadeInUp} className="text-accent font-medium text-sm uppercase tracking-wider">
                  ⚖️ Compare Builds
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-display text-5xl md:text-6xl font-bold text-text-primary mt-4">
                  Quick Build Comparison
                </motion.h2>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
              >
                <div className="rounded-2xl overflow-hidden border border-border/20 bg-surface-1/40 backdrop-blur-xl">
                  {/* Tabs */}
                  <div className="flex overflow-x-auto border-b border-border/10">
                    {comparisonPresets.map((preset, i) => (
                      <motion.button
                        key={preset.name}
                        onClick={() => setComparisonIndex(i)}
                        className={`px-6 py-4 font-semibold whitespace-nowrap transition-all ${
                          comparisonIndex === i
                            ? 'text-accent border-b-2 border-accent'
                            : 'text-text-muted hover:text-text-primary'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {preset.name}
                      </motion.button>
                    ))}
                  </div>

                  {/* Content */}
                  <motion.div
                    key={comparisonIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 md:p-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <p className="text-sm text-text-muted uppercase font-bold tracking-wider">Total Budget</p>
                        <p className="text-4xl font-black text-text-primary mt-2">{comparisonPresets[comparisonIndex].price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted uppercase font-bold tracking-wider">Performance</p>
                        <p className="text-4xl font-black text-accent mt-2">{comparisonPresets[comparisonIndex].fps}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted uppercase font-bold tracking-wider">Optimized For</p>
                        <p className="text-4xl font-black text-purple-400 mt-2">{comparisonPresets[comparisonIndex].game}</p>
                      </div>
                    </div>
                    <motion.div
                      className="mt-8 pt-8 border-t border-border/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        href="/builder"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all"
                      >
                        Build This Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* GAMIFICATION BADGES SECTION - NEW */}
          <section className="py-32 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 via-transparent to-amber-500/10 pointer-events-none" />
            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-20"
              >
                <motion.span variants={fadeInUp} className="text-accent font-medium text-sm uppercase tracking-wider">
                  🏆 Unlock Achievements
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-display text-5xl md:text-6xl font-bold text-text-primary mt-4">
                  Earn Badges & Rewards
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-text-muted text-xl mt-6 max-w-2xl mx-auto">
                  Build amazing PCs and earn recognition in our community.
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {badges.map((badge, i) => (
                  <motion.div
                    key={badge.title}
                    variants={scaleIn}
                    className="group"
                  >
                    <motion.div
                      className="p-8 rounded-2xl bg-gradient-to-br from-surface-1/60 to-surface-2/30 backdrop-blur-xl border border-border/20 hover:border-accent/50 transition-all text-center flex flex-col items-center gap-4"
                      whileHover={{ y: -12, scale: 1.05 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      >
                        <badge.icon className={`w-12 h-12 ${badge.color}`} />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-lg text-text-primary">{badge.title}</h3>
                        <p className="text-sm text-text-muted mt-1">{badge.description}</p>
                      </div>
                      <motion.button
                        className="mt-4 px-4 py-2 rounded-lg bg-accent/20 border border-accent/50 text-accent text-sm font-semibold hover:bg-accent/30 transition-all"
                        whileHover={{ scale: 1.05 }}
                      >
                        Unlock Now
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Testimonials Section - ENHANCED */}
          <section className="py-32 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.span variants={fadeInUp} className="text-accent font-medium text-sm uppercase tracking-wider">
                  ⭐ Loved by Builders
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-display text-5xl md:text-6xl font-bold text-text-primary mt-4">
                  Join 50,000+ Happy Builders
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-text-muted text-xl mt-4 max-w-2xl mx-auto">
                  Real builders, real results, real impact.
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {[
                  {
                    text: "Saved me $600 and found compatible parts I didn't know existed. The AI recommendations are spot-on.",
                    author: "Marcus Chen",
                    role: "Gaming Enthusiast",
                    avatar: "🎮",
                    saved: "$600"
                  },
                  {
                    text: "First time building a PC. This tool made it so easy. Support team was incredibly helpful!",
                    author: "Sarah Martinez",
                    role: "First-Time Builder",
                    avatar: "👩‍💻",
                    saved: "$200"
                  },
                  {
                    text: "Using this for my streaming setup was a game-changer. Price tracking alone saves me hundreds.",
                    author: "Tyler Brooks",
                    role: "Content Creator",
                    avatar: "🎬",
                    saved: "$500"
                  },
                  {
                    text: "Compatibility checker found issues I would've missed. Literally saved me from expensive mistakes.",
                    author: "Alex Kim",
                    role: "3D Animator",
                    avatar: "🎨",
                    saved: "$800"
                  },
                  {
                    text: "Best PC builder tool out there. The 3D previews helped me plan cable management perfectly.",
                    author: "Jordan Lee",
                    role: "PC Modder",
                    avatar: "🛠️",
                    saved: "$300"
                  },
                  {
                    text: "The community builds section helped me learn so much. Got my first 5-star build thanks to ZenPC!",
                    author: "Casey Johnson",
                    role: "Enthusiast",
                    avatar: "⚡",
                    saved: "$450"
                  }
                ].map((testimonial, i) => (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    className="group"
                  >
                    <motion.div
                      className="h-full p-8 rounded-2xl bg-gradient-to-br from-surface-1/60 to-surface-2/30 backdrop-blur-xl border border-border/20 hover:border-accent/50 transition-all flex flex-col"
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex -space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                          ))}
                        </div>
                        <span className="text-xl font-black text-green-400">{testimonial.saved}</span>
                      </div>
                      <p className="text-text-muted italic mb-6 flex-grow">{testimonial.text}</p>
                      <div className="border-t border-border/10 pt-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{testimonial.avatar}</div>
                          <div>
                            <p className="font-bold text-text-primary text-sm">{testimonial.author}</p>
                            <p className="text-xs text-text-muted">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* 3D PC VISUALIZER SECTION - NEW */}
          <section className="py-32 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-red-500/10 pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-20"
              >
                <motion.span variants={fadeInUp} className="text-accent font-medium text-sm uppercase tracking-wider">
                  🎮 Interactive 3D Preview
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-display text-5xl md:text-6xl font-bold text-text-primary mt-4">
                  See Your PC in 3D
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-text-muted text-xl mt-6 max-w-3xl mx-auto">
                  Visualize your complete build before purchasing. See component placement, color coordination, and cable management in stunning 3D detail.
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
              >
                {/* 3D Visualizer - ADVANCED */}
                <motion.div
                  className="lg:col-span-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <PCVisualizer3DAdvanced 
                    selectedParts={{
                      gpu: { name: 'RTX 4070 Ti', color: '#ff4444' },
                      cpu: { name: 'i9-13900K', color: '#0084d1' },
                      ram: { name: 'G.Skill Trident Z5', color: '#f0ad4e' },
                      storage: { name: 'Samsung 990 Pro', color: '#5cb85c' },
                    }}
                    autoRotate={true}
                    height="600px"
                    showControls={true}
                    showLabels={true}
                    theme="dark"
                    mouseControls={true}
                    quality="high"
                  />
                </motion.div>

                {/* Features List */}
                <motion.div className="space-y-6">
                  <div className="space-y-8">
                    {[
                      {
                        icon: Eye,
                        title: '360° Inspection',
                        description: 'Rotate, zoom, and inspect from every angle with smooth, hardware-accelerated rendering.'
                      },
                      {
                        icon: Layers,
                        title: 'Exploded View',
                        description: 'See component separation and understand exact placement within your case.'
                      },
                      {
                        icon: Zap,
                        title: 'Real-time Updates',
                        description: 'Watch the 3D model update instantly as you select components in the builder.'
                      },
                      {
                        icon: Gauge,
                        title: 'Smart Lighting',
                        description: 'Switch themes to visualize your build in different lighting conditions.'
                      }
                    ].map((item, i) => (
                      <motion.div
                        key={item.title}
                        variants={fadeInUp}
                        className="flex gap-4 p-4 rounded-lg bg-surface-1/40 border border-border/20 hover:border-accent/50 transition-all"
                        whileHover={{ x: 8 }}
                      >
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/20">
                            <item.icon className="w-5 h-5 text-accent" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-text-primary mb-1">{item.title}</h3>
                          <p className="text-xs text-text-muted">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="pt-4"
                  >
                    <Link
                      href="/builder"
                      className="inline-flex items-center justify-center w-full gap-2 px-6 py-4 bg-gradient-to-r from-accent to-purple-600 text-white font-bold rounded-lg shadow-lg shadow-accent/40 hover:shadow-xl hover:shadow-accent/50 transition-all"
                    >
                      Try 3D Preview Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Additional showcase builds with 3D previews */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="mt-20 pt-20 border-t border-border/20"
              >
                <motion.h3 variants={fadeInUp} className="text-3xl font-bold text-text-primary mb-12 text-center">
                  Sample Builds in 3D
                </motion.h3>

                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12"
                >
                  {[
                    {
                      name: 'Gaming Powerhouse',
                      desc: 'RTX 4070 Ti + i9-13900K',
                      gpu: '#ff4444',
                      cpu: '#0084d1',
                      parts: {
                        gpu: { name: 'RTX 4070 Ti', color: '#ff4444' },
                        cpu: { name: 'i9-13900K', color: '#0084d1' },
                        ram: { name: 'Corsair Dominator', color: '#f0ad4e' },
                        storage: { name: 'Samsung SSD', color: '#5cb85c' },
                      }
                    },
                    {
                      name: '3D Workstation',
                      desc: 'RTX 6900 XT + Threadripper',
                      gpu: '#ff8800',
                      cpu: '#ffaa00',
                      parts: {
                        gpu: { name: 'RTX 6900 XT', color: '#ff8800' },
                        cpu: { name: 'Threadripper PRO', color: '#ffaa00' },
                        ram: { name: 'Kingston FURY', color: '#f0ad4e' },
                        storage: { name: 'WD Black SN850X', color: '#5cb85c' },
                      }
                    }
                  ].map((build, i) => (
                    <motion.div
                      key={build.name}
                      variants={scaleIn}
                      className="space-y-4"
                    >
                      <div className="rounded-lg overflow-hidden bg-gradient-to-br from-surface-1/60 to-surface-2/30 border border-border/20 p-6 space-y-4">
                        <div>
                          <h4 className="text-xl font-bold text-text-primary">{build.name}</h4>
                          <p className="text-sm text-accent">{build.desc}</p>
                        </div>
                        <PCVisualizer3DAdvanced
                          selectedParts={build.parts}
                          autoRotate={true}
                          height="320px"
                          showControls={true}
                          showLabels={true}
                          theme="ambient"
                          mouseControls={true}
                          quality="medium"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent font-semibold rounded-lg transition-all"
                        >
                          View Details & Build
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ADVANCED FEATURES SHOWCASE - NEW */}
          <section className="py-32 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-rose-500/10 pointer-events-none" />
            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-20"
              >
                <motion.span variants={fadeInUp} className="text-accent font-medium text-sm uppercase tracking-wider">
                  🚀 Advanced Tools
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-display text-5xl md:text-6xl font-bold text-text-primary mt-4">
                  Pro-Grade Features
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-text-muted text-xl mt-6 max-w-2xl mx-auto">
                  Everything you need for professional PC building and optimization.
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {[
                  {
                    icon: Wand2,
                    title: '3D Component Visualizer',
                    description: 'See exactly how your PC looks with real 3D models. Check cable routing, airflow, and aesthetics before purchase.',
                    features: ['360° rotation', 'Component details', 'Airflow simulation', 'Custom lighting']
                  },
                  {
                    icon: BarChart3,
                    title: 'Performance Benchmarks',
                    description: 'Real-world performance data from thousands of builds. Know exactly what to expect.',
                    features: ['Gaming FPS', '3D rendering', 'Encoding speed', 'Thermal info']
                  },
                  {
                    icon: Code,
                    title: 'API Integration',
                    description: 'Connect with your favorite retailers and tools. Automate price tracking and notifications.',
                    features: ['Price alerts', 'Stock tracking', 'Webhooks', 'REST API']
                  },
                  {
                    icon: Lightning,
                    title: 'AI Optimization Engine',
                    description: 'Machine learning-powered recommendations get smarter with every build created.',
                    features: ['Budget matching', 'Efficiency scoring', 'Trend analysis', 'Pattern learning']
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    variants={scaleIn}
                    className="group"
                  >
                    <motion.div
                      className="h-full p-10 rounded-2xl bg-gradient-to-br from-surface-1/60 to-surface-2/30 backdrop-blur-xl border border-border/20 hover:border-accent/50 transition-all"
                      whileHover={{ y: -12, scale: 1.02 }}
                    >
                      <motion.div
                        className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent/30 to-purple-600/30 flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-accent/20"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                      >
                        <feature.icon className="w-8 h-8 text-accent" />
                      </motion.div>
                      
                      <h3 className="font-bold text-2xl text-text-primary mb-3">{feature.title}</h3>
                      <p className="text-text-muted mb-6 leading-relaxed">{feature.description}</p>
                      
                      <div className="space-y-2">
                        {feature.features.map((feat) => (
                          <motion.div 
                            key={feat}
                            className="flex items-center gap-2 text-sm text-text-muted"
                            whileHover={{ x: 6 }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                            {feat}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* PRICING PREVIEW SECTION - NEW */}
          <section className="py-32 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-accent/10 pointer-events-none" />
            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-20"
              >
                <motion.span variants={fadeInUp} className="text-accent font-medium text-sm uppercase tracking-wider">
                  💰 Simple Pricing
                </motion.span>
                <motion.h2 variants={fadeInUp} className="font-display text-5xl md:text-6xl font-bold text-text-primary mt-4">
                  Start Free, Scale as You Grow
                </motion.h2>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              >
                {[
                  {
                    name: 'Starter',
                    price: 'Free',
                    description: 'Perfect for your first build',
                    features: ['Unlimited builds', 'Basic AI recommendations', 'Community access', 'Basic compatibility check'],
                    highlighted: false
                  },
                  {
                    name: 'Pro',
                    price: '$9.99/mo',
                    description: 'For serious builders',
                    features: ['Everything in Starter', 'Advanced price tracking', 'Priority support', '3D visualizer', 'Performance benchmarks'],
                    highlighted: true
                  },
                  {
                    name: 'Enterprise',
                    price: 'Custom',
                    description: 'For teams & resellers',
                    features: ['Everything in Pro', 'API access', 'Custom branding', 'White-label option', 'Dedicated support'],
                    highlighted: false
                  }
                ].map((plan, i) => (
                  <motion.div
                    key={plan.name}
                    variants={scaleIn}
                    className={`group ${plan.highlighted ? 'lg:scale-105' : ''}`}
                  >
                    <motion.div
                      className={`h-full p-10 rounded-2xl backdrop-blur-xl border transition-all relative ${
                        plan.highlighted
                          ? 'bg-gradient-to-br from-accent/40 to-purple-600/40 border-accent/60 shadow-2xl shadow-accent/30'
                          : 'bg-gradient-to-br from-surface-1/60 to-surface-2/30 border-border/20 hover:border-accent/50'
                      }`}
                      whileHover={{ y: -8 }}
                    >
                      {plan.highlighted && (
                        <motion.div
                          className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-white text-xs font-black uppercase tracking-wider"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🔥 Most Popular
                        </motion.div>
                      )}
                      
                      <h3 className="font-bold text-2xl text-text-primary mb-2">{plan.name}</h3>
                      <p className="text-text-muted text-sm mb-6">{plan.description}</p>
                      
                      <div className="mb-8">
                        <motion.p 
                          className="text-4xl font-black text-accent"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          {plan.price}
                        </motion.p>
                      </div>

                      <div className="space-y-3 mb-8">
                        {plan.features.map((feature) => (
                          <motion.div
                            key={feature}
                            className="flex items-start gap-3"
                            whileHover={{ x: 6 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-text-muted">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      <motion.button
                        className={`w-full py-3 rounded-lg font-bold transition-all ${
                          plan.highlighted
                            ? 'bg-white text-accent hover:bg-accent/10 hover:text-white'
                            : 'bg-accent/20 text-accent hover:bg-accent/40'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Get Started
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Final CTA Section - ULTRA DRAMATIC */}
          <section className="py-32 px-4 relative overflow-hidden">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="max-w-5xl mx-auto"
            >
              <div className="relative p-16 md:p-24 rounded-3xl overflow-hidden group">
                {/* Dynamic gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-purple-600/30 to-cyan-600/40" />
                <div className="absolute inset-0 backdrop-blur-xl" />
                <div className="absolute inset-0 bg-surface-1/60" />
                <div className="absolute inset-0 border-2 border-accent/40 rounded-3xl group-hover:border-accent/70 transition-all" />

                {/* Animated background shapes */}
                <motion.div 
                  animate={{ 
                    y: [0, 40, 0], 
                    rotate: [0, 5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/40 blur-3xl" 
                />
                <motion.div 
                  animate={{ 
                    y: [0, -40, 0], 
                    rotate: [0, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-600/40 blur-3xl" 
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl -translate-x-1/2 -translate-y-1/2" 
                />

                <div className="relative text-center space-y-10 z-10">
                  <motion.h2
                    className="font-display text-5xl md:text-7xl font-black text-white leading-tight"
                    variants={fadeInUp}
                  >
                    Your Perfect Build
                    <br />
                    <span className="bg-gradient-to-r from-white via-accent to-cyan-300 bg-clip-text text-transparent">
                      Is 60 Seconds Away
                    </span>
                  </motion.h2>

                  <motion.p
                    className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    variants={fadeInUp}
                  >
                    Join 50,000 builders who&apos;ve already saved thousands and built their dream PCs with confidence. No expertise needed, just results.
                  </motion.p>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
                    variants={fadeInUp}
                  >
                    <motion.div whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/builder"
                        className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-white text-accent font-black text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all border-2 border-white"
                      >
                        <Rocket className="w-6 h-6" />
                        Start Building Now
                        <ArrowRight className="w-6 h-6" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button className="inline-flex items-center justify-center gap-3 px-12 py-6 border-2 border-white text-white font-black text-lg rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm">
                        <Play className="w-6 h-6" />
                        Watch Tutorial
                      </button>
                    </motion.div>
                  </motion.div>

                  {/* Trust badges */}
                  <motion.div
                    className="flex flex-wrap justify-center gap-6 text-sm pt-12"
                    variants={fadeInUp}
                  >
                    {[
                      { icon: '✓', text: '100% Compatible Guarantee' },
                      { icon: '💰', text: 'Best Price Promise' },
                      { icon: '🚀', text: 'Lightning Fast' },
                      { icon: '🎯', text: 'AI-Optimized' }
                    ].map((badge) => (
                      <motion.div
                        key={badge.text}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <span className="text-white/90">{badge.text}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </section>
        </main>

        {/* Footer - ULTRA PREMIUM */}
        <footer className="relative z-10 w-full bg-gradient-to-b from-surface-1/50 to-bg backdrop-blur-xl border-t border-accent/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
            {/* Newsletter section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mb-20 pb-20 border-b border-accent/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
                    Stay Updated
                  </h3>
                  <p className="text-text-muted text-lg">
                    Get exclusive tips, build guides, and be the first to know about new features and deals.
                  </p>
                </div>
                <motion.form 
                  className="flex gap-3 flex-col sm:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-xl bg-surface-2/50 border border-accent/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition-all"
                  />
                  <motion.button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-accent to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-accent/30 transition-all whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </motion.form>
              </div>
            </motion.div>

            {/* Links grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
              {/* Brand */}
              <motion.div 
                className="space-y-6 md:col-span-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="flex items-center gap-3 inline-block group">
                  <motion.div 
                    className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className="font-display font-black text-white">Z</span>
                  </motion.div>
                  <span className="font-display text-2xl font-bold bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent group-hover:to-cyan-400 transition-all">
                    ZenPC
                  </span>
                </Link>
                <p className="text-text-muted text-sm leading-relaxed">
                  The smarter way to build your perfect PC. AI-powered, community-driven, guaranteed compatible.
                </p>
                <div className="flex gap-3">
                  {['🐦', '💬', '📸', '🎮'].map((icon) => (
                    <motion.button
                      key={icon}
                      className="text-2xl hover:scale-125 transition-transform"
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Links columns */}
              {[
                {
                  title: 'Product', links: [
                    { name: 'PC Builder', href: '/builder' },
                    { name: 'Build Guides', href: '/builder?tab=guide' },
                    { name: 'Community', href: '/community' },
                    { name: 'Pricing', href: '/pricing' },
                    { name: 'API Docs', href: '/docs/api' },
                  ]
                },
                {
                  title: 'Company', links: [
                    { name: 'About Us', href: '/about' },
                    { name: 'Blog', href: '/blog' },
                    { name: 'Careers', href: '/careers' },
                    { name: 'Press Kit', href: '/press' },
                    { name: 'Contact', href: '/contact' },
                  ]
                },
                {
                  title: 'Support', links: [
                    { name: 'Help Center', href: '/help' },
                    { name: 'Documentation', href: '/docs' },
                    { name: 'Status', href: '/status' },
                    { name: 'Discord', href: 'https://discord.gg/zenpc' },
                    { name: 'Email Us', href: 'mailto:support@zenpc.ai' },
                  ]
                },
                {
                  title: 'Legal', links: [
                    { name: 'Privacy Policy', href: '/privacy' },
                    { name: 'Terms of Service', href: '/terms' },
                    { name: 'Cookie Policy', href: '/cookies' },
                    { name: 'Disclaimer', href: '/disclaimer' },
                    { name: 'Compliance', href: '/compliance' },
                  ]
                },
              ].map((section, idx) => (
                <motion.div 
                  key={section.title} 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <nav className="space-y-3">
                    {section.links.map((link) => (
                      <motion.div key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-text-muted hover:text-accent transition-colors flex items-center group"
                        >
                          <span className="h-0.5 w-0 bg-accent group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300" />
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </motion.div>
              ))}
            </div>

            {/* Bottom section */}
            <motion.div 
              className="border-t border-accent/10 pt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-sm text-text-muted/70">
                  <p>© {new Date().getFullYear()} ZenPC. All rights reserved. | Built with ❤️ for PC enthusiasts</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  {[
                    { icon: '✓', text: '100% Compatible' },
                    { icon: '💰', text: 'Best Prices' },
                    { icon: '🔒', text: 'Secure' },
                    { icon: '⚡', text: 'Fast Support' }
                  ].map((item) => (
                    <motion.span
                      key={item.text}
                      className="flex items-center gap-1 text-text-muted/80 hover:text-accent transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span>{item.icon}</span>
                      {item.text}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
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
