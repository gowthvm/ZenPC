'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import { Heart, Target, Users, Zap, ArrowRight } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Precision',
    description: 'Every compatibility check, every recommendation is backed by rigorous testing and real-world data.',
    color: 'from-blue-500/20 to-cyan-600/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Built by PC enthusiasts, for PC enthusiasts. Your feedback shapes our product.',
    color: 'from-purple-500/20 to-violet-600/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We love building PCs as much as you do. That passion drives everything we create.',
    color: 'from-rose-500/20 to-pink-600/20',
    iconColor: 'text-rose-400',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Constantly pushing boundaries with AI recommendations and real-time compatibility.',
    color: 'from-amber-500/20 to-orange-600/20',
    iconColor: 'text-amber-400',
  },
];

const stats = [
  { value: '10,000+', label: 'Builds Created' },
  { value: '500+', label: 'Components' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
];

export default function AboutPage() {
  return (
    <PageLayout
      title="About ZenPC"
      description="We're on a mission to make PC building accessible, enjoyable, and foolproof for everyone."
    >
      {/* Story Section */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold text-text-primary">Our Story</h2>
            <p className="text-text-muted leading-relaxed">
              ZenPC was born from frustration. As PC enthusiasts ourselves, we experienced
              the pain of compatibility issues, confusing specifications, and scattered
              information across dozens of tabs.
            </p>
            <p className="text-text-muted leading-relaxed">
              We built ZenPC to be the tool we always wished we had — an intelligent,
              beautiful, and comprehensive platform that guides you from part selection
              to completed build.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl transition-all"
              >
                Start Building
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-accent/20 via-purple-600/10 to-cyan-600/20 border border-border/20 flex items-center justify-center">
              <div className="text-6xl">🖥️</div>
            </div>
            {/* Floating decorations */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-xl bg-accent/20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl bg-purple-600/20 blur-xl" />
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        className="mb-20 py-12 px-8 rounded-2xl bg-surface-1/40 backdrop-blur-xl border border-border/10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-text-muted text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Values */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">
          Our Values
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-surface-1/40 backdrop-blur-xl border border-border/10 hover:border-accent/30 transition-all group"
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <value.icon className={`w-6 h-6 ${value.iconColor}`} />
              </div>
              <h3 className="font-semibold text-xl text-text-primary mb-2">{value.title}</h3>
              <p className="text-text-muted">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </PageLayout>
  );
}
