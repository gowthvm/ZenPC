'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import { Users, MessageSquare, Trophy, Star, ArrowRight } from 'lucide-react';

const stats = [
  { value: '50K+', label: 'Members', icon: Users },
  { value: '100K+', label: 'Builds Shared', icon: Star },
  { value: '10K+', label: 'Discussions', icon: MessageSquare },
];

const featuredBuilds = [
  { title: 'Ultimate 4K Gaming Rig', author: 'TechMaster', likes: 234, budget: '$3,500' },
  { title: 'Budget Streaming Setup', author: 'StreamerPro', likes: 189, budget: '$1,200' },
  { title: 'Compact Workstation', author: 'DevGuru', likes: 156, budget: '$2,800' },
  { title: 'RGB Dream Machine', author: 'LightShow', likes: 145, budget: '$4,200' },
];

export default function CommunityPage() {
  return (
    <PageLayout
      title="Community"
      description="Join thousands of PC enthusiasts sharing builds, tips, and knowledge"
      maxWidth="6xl"
    >
      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 rounded-2xl bg-surface-1/40 border border-border/10 text-center"
            >
              <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-3xl font-bold text-text-primary mb-1">{stat.value}</div>
              <div className="text-text-muted text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Builds */}
      <motion.section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold text-text-primary">Featured Builds</h2>
          <Link href="#" className="text-accent text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {featuredBuilds.map((build, index) => (
            <motion.div
              key={build.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-6 rounded-2xl bg-surface-1/40 border border-border/10 hover:border-accent/30 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-text-primary group-hover:text-accent transition-colors">
                    {build.title}
                  </h3>
                  <p className="text-text-muted text-sm">by @{build.author}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  {build.budget}
                </span>
              </div>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Star className="w-4 h-4 text-amber-400" />
                {build.likes} likes
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Join CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-12 rounded-2xl bg-gradient-to-br from-accent/10 via-purple-600/5 to-cyan-600/10 border border-border/10 text-center"
      >
        <Trophy className="w-12 h-12 text-accent mx-auto mb-6" />
        <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
          Join the Community
        </h2>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          Share your builds, get feedback, and learn from fellow PC enthusiasts.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl transition-all"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.section>
    </PageLayout>
  );
}
