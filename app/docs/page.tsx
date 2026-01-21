'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import { Code, Zap, Database, Shield, ArrowRight, Book, FileCode, Terminal } from 'lucide-react';

const docSections = [
  {
    icon: Book,
    title: 'Introduction',
    description: 'Get started with ZenPC and understand the basics',
    href: '/docs/intro',
    color: 'from-blue-500/20 to-cyan-600/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: FileCode,
    title: 'API Reference',
    description: 'Detailed documentation of our REST API endpoints',
    href: '/docs/api',
    color: 'from-green-500/20 to-emerald-600/20',
    iconColor: 'text-green-400',
  },
  {
    icon: Terminal,
    title: 'CLI Tools',
    description: 'Command-line interface for power users',
    href: '/docs/cli',
    color: 'from-purple-500/20 to-violet-600/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Database,
    title: 'Data Models',
    description: 'Understanding our component database structure',
    href: '/docs/data',
    color: 'from-amber-500/20 to-orange-600/20',
    iconColor: 'text-amber-400',
  },
];

const quickLinks = [
  { title: 'Quick Start', href: '/docs/quickstart', icon: Zap },
  { title: 'Authentication', href: '/docs/auth', icon: Shield },
  { title: 'Components API', href: '/docs/api/components', icon: Code },
  { title: 'Builds API', href: '/docs/api/builds', icon: Database },
];

export default function DocsPage() {
  return (
    <PageLayout
      title="Documentation"
      description="Everything you need to integrate with ZenPC and build amazing experiences"
      maxWidth="6xl"
    >
      {/* Quick Links */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Link
                href={link.href}
                className="flex items-center gap-3 p-4 rounded-xl bg-surface-1/40 border border-border/10 hover:border-accent/30 transition-all group"
              >
                <link.icon className="w-5 h-5 text-accent" />
                <span className="text-text-primary font-medium group-hover:text-accent transition-colors">
                  {link.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Main Sections */}
      <motion.section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-text-primary mb-8">
          Explore Docs
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {docSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link
                href={section.href}
                className="block p-6 rounded-2xl bg-surface-1/40 border border-border/10 hover:border-accent/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <section.icon className={`w-6 h-6 ${section.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-text-primary">{section.title}</h3>
                      <ArrowRight className="w-5 h-5 text-text-muted/50 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-text-muted text-sm">{section.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Code Example */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-2xl bg-surface-1/40 border border-border/10"
      >
        <h2 className="font-display text-xl font-bold text-text-primary mb-6">
          Quick Example
        </h2>
        <div className="rounded-xl bg-[#1a1a2e] p-6 overflow-x-auto">
          <pre className="text-sm">
            <code className="text-green-400">
              {`// Fetch compatible components
const response = await fetch('https://api.zenpc.com/v1/components', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const components = await response.json();
console.log(components);`}
            </code>
          </pre>
        </div>
        <p className="text-text-muted text-sm mt-4">
          See the <Link href="/docs/api" className="text-accent hover:underline">API Reference</Link> for more examples.
        </p>
      </motion.section>
    </PageLayout>
  );
}
