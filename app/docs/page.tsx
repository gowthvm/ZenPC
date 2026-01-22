'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import {
  Code, Zap, Database, Shield, ArrowRight, Book, FileCode, Terminal,
  Lightbulb, Rocket, GitBranch, Settings, CheckCircle2, Layers,
  Cpu, Network, Lock, Zap as Lightning, TrendingUp, Gauge
} from 'lucide-react';
import {
  PremiumCard, FeatureCard, PremiumButton, GradientText,
  AnimatedBadge, TimelineItem, Reveal, LoadingSkeleton
} from '@/components/ui/AdvancedComponents';

const docSections = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn the basics and set up your development environment in minutes',
    href: '/docs/intro',
    badge: 'NEW',
    color: 'from-blue-500/30 to-cyan-600/20',
    iconColor: 'text-blue-400',
    topics: ['Installation', 'First Build', 'Configuration'],
  },
  {
    icon: FileCode,
    title: 'API Reference',
    description: 'Complete REST API documentation with examples and response schemas',
    href: '/docs/api',
    color: 'from-green-500/30 to-emerald-600/20',
    iconColor: 'text-green-400',
    topics: ['Endpoints', 'Authentication', 'Rate Limits'],
  },
  {
    icon: Terminal,
    title: 'CLI Tools',
    description: 'Powerful command-line interface for advanced users and automation',
    href: '/docs/cli',
    color: 'from-purple-500/30 to-violet-600/20',
    iconColor: 'text-purple-400',
    topics: ['Commands', 'Scripts', 'Aliases'],
  },
  {
    icon: Database,
    title: 'Data Models',
    description: 'Understand our database structure and component relationships',
    href: '/docs/data',
    color: 'from-amber-500/30 to-orange-600/20',
    iconColor: 'text-amber-400',
    topics: ['Schemas', 'Relationships', 'Queries'],
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Best practices for securing your API keys and user data',
    href: '/docs/security',
    color: 'from-rose-500/30 to-pink-600/20',
    iconColor: 'text-rose-400',
    topics: ['Authentication', 'Encryption', 'Best Practices'],
  },
  {
    icon: Rocket,
    title: 'Deployment',
    description: 'Deploy your application to production with confidence',
    href: '/docs/deployment',
    color: 'from-indigo-500/30 to-blue-600/20',
    iconColor: 'text-indigo-400',
    topics: ['Hosting', 'Scaling', 'Monitoring'],
  },
];

const quickLinks = [
  { title: 'Quick Start', href: '/docs/quickstart', icon: Zap, desc: '5 minutes to first API call' },
  { title: 'Authentication', href: '/docs/auth', icon: Shield, desc: 'Secure your requests' },
  { title: 'Components API', href: '/docs/api/components', icon: Cpu, desc: 'Query PC components' },
  { title: 'Builds API', href: '/docs/api/builds', icon: Database, desc: 'Manage builds' },
];

const guideTips = [
  {
    step: 1,
    title: 'Set Up Your API Key',
    description: 'Generate your API key from the dashboard and keep it secure',
  },
  {
    step: 2,
    title: 'Make Your First Request',
    description: 'Use our SDKs or cURL to fetch components and validate compatibility',
  },
  {
    step: 3,
    title: 'Build the Integration',
    description: 'Integrate ZenPC into your application with our comprehensive SDKs',
  },
  {
    step: 4,
    title: 'Test & Deploy',
    description: 'Test thoroughly in sandbox mode before deploying to production',
  },
];

const codeExamples = [
  {
    language: 'JavaScript',
    code: `const zenpc = require('zenpc-sdk');
const client = new zenpc.Client({
  apiKey: process.env.ZENPC_API_KEY
});

// Get compatible GPUs
const gpus = await client.components.list({
  category: 'GPU',
  maxPrice: 500
});`,
  },
  {
    language: 'Python',
    code: `import zenpc

client = zenpc.Client(api_key='your_api_key')

# Create a PC build
build = client.builds.create({
  'name': 'Gaming Rig',
  'cpu': 'cpu_123',
  'gpu': 'gpu_456',
  'ram': 'ram_789'
})`,
  },
  {
    language: 'cURL',
    code: `curl -X GET https://api.zenpc.com/v1/components \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"category": "GPU", "limit": 10}'`,
  },
];

export default function DocsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const selectedExample = codeExamples.find(ex => ex.language === selectedLanguage) || codeExamples[0];

  return (
    <PageLayout
      title="Developer Documentation"
      description="Complete guides, API reference, and code examples to integrate ZenPC into your application"
      maxWidth="7xl"
    >
      {/* Quick Links */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-20"
      >
        <h3 className="font-display text-lg font-semibold text-text-primary mb-6">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Reveal key={link.title} delay={index * 0.05}>
              <Link href={link.href}>
                <PremiumCard variant="gradient" hoverEffect="lift" interactive>
                  <div className="flex items-start gap-3">
                    <link.icon className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-text-primary text-sm">
                        {link.title}
                      </div>
                      <div className="text-text-muted text-xs">{link.desc}</div>
                    </div>
                  </div>
                </PremiumCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </motion.section>

      {/* Code Examples */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl font-bold text-text-primary mb-12">
          Code Examples
        </h2>
        <PremiumCard variant="accent" className="overflow-hidden">
          <div className="p-8">
            <div className="flex gap-2 mb-6">
              {codeExamples.map((example) => (
                <button
                  key={example.language}
                  onClick={() => setSelectedLanguage(example.language)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedLanguage === example.language
                      ? 'bg-accent/20 text-accent border border-accent/40'
                      : 'bg-surface-1/40 text-text-muted hover:text-text-primary border border-border/10'
                    }`}
                >
                  {example.language}
                </button>
              ))}
            </div>
            <div className="rounded-xl bg-[#0f0f1e] p-6 overflow-x-auto border border-border/10">
              <pre className="text-sm font-mono">
                <code className="text-green-400">{selectedExample.code}</code>
              </pre>
            </div>
          </div>
        </PremiumCard>
      </motion.section>

      {/* Main Doc Sections */}
      <motion.section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-text-primary mb-12">
          Explore Documentation
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {docSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Reveal key={section.title} delay={index * 0.1}>
                <Link href={section.href}>
                  <PremiumCard
                    variant="gradient"
                    hoverEffect="lift"
                    interactive
                    className="h-full"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`h-14 w-14 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-7 h-7 ${section.iconColor}`} />
                      </div>
                      {section.badge && (
                        <AnimatedBadge variant="neon">{section.badge}</AnimatedBadge>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                      {section.title}
                    </h3>
                    <p className="text-text-muted text-sm mb-4">{section.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {section.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2.5 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/20"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </PremiumCard>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </motion.section>

      {/* Getting Started Timeline */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl font-bold text-text-primary mb-12">
          Getting Started in 4 Steps
        </h2>
        <div className="max-w-2xl mx-auto">
          {guideTips.map((guide, i) => (
            <TimelineItem
              key={guide.step}
              step={guide.step}
              title={guide.title}
              description={guide.description}
              isLast={i === guideTips.length - 1}
            />
          ))}
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">
          Developer-Friendly Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Lightning,
              title: 'REST API',
              description: 'Simple, intuitive REST endpoints with comprehensive documentation',
            },
            {
              icon: Layers,
              title: 'SDKs',
              description: 'Official SDKs for JavaScript, Python, Go, and more',
            },
            {
              icon: Network,
              title: 'Webhooks',
              description: 'Real-time notifications for builds, price changes, and events',
            },
            {
              icon: Gauge,
              title: 'Rate Limiting',
              description: 'Generous rate limits: 1000 requests/minute for free tier',
            },
            {
              icon: Lock,
              title: 'Security',
              description: 'OAuth2, API key authentication, and end-to-end encryption',
            },
            {
              icon: TrendingUp,
              title: 'Analytics',
              description: 'Detailed usage analytics and performance monitoring',
            },
          ].map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={<feature.icon size={32} className="text-accent" />}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </motion.section>

      {/* Sandbox/Production Toggle */}
      <motion.section
        className="card-gradient p-12 mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="font-display text-2xl font-bold text-text-primary mb-4">
          Test in Sandbox Mode
        </h3>
        <p className="text-text-muted mb-6">
          Start testing with our sandbox environment before going live. Sandbox keys are free and have no rate limits.
        </p>
        <PremiumButton variant="primary" icon={<ArrowRight size={18} />}>
          Get Sandbox API Key
        </PremiumButton>
      </motion.section>

      {/* Support Section */}
      <motion.section
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <PremiumCard variant="gradient">
          <Lightbulb className="w-8 h-8 text-accent mb-4" />
          <h3 className="font-display text-lg font-bold text-text-primary mb-2">
            Need Help?
          </h3>
          <p className="text-text-muted text-sm mb-4">
            Check our FAQ or join our developer community on Discord
          </p>
          <PremiumButton
            variant="secondary"
            size="sm"
            onClick={() => window.location.href = '/support'}
          >
            Get Support
          </PremiumButton>
        </PremiumCard>

        <PremiumCard variant="accent">
          <Rocket className="w-8 h-8 text-accent mb-4" />
          <h3 className="font-display text-lg font-bold text-text-primary mb-2">
            Ready to Deploy?
          </h3>
          <p className="text-text-muted text-sm mb-4">
            Follow our deployment guide and best practices for production
          </p>
          <PremiumButton
            variant="primary"
            size="sm"
            onClick={() => window.location.href = '/docs/deployment'}
          >
            Deploy Now
          </PremiumButton>
        </PremiumCard>
      </motion.section>
    </PageLayout>
  );
}
