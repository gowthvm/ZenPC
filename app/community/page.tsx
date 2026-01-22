'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import {
  Users, MessageSquare, Trophy, Star, ArrowRight, Zap,
  Heart, Share2, TrendingUp, Award, Flame, Crown,
  MessageCircle, Bookmark, Eye, Download
} from 'lucide-react';
import {
  PremiumCard, FeatureCard, StatCard, PremiumButton,
  GradientText, AnimatedBadge, TimelineItem, Reveal
} from '@/components/ui/AdvancedComponents';

const stats = [
  { value: '50K+', label: 'Active Members', icon: Users },
  { value: '250K+', label: 'Builds Shared', icon: TrendingUp },
  { value: '1.2M+', label: 'Comments & Tips', icon: MessageCircle },
  { value: '$12M+', label: 'Saved Together', icon: Trophy },
];

const featuredBuilds = [
  {
    id: 1,
    title: 'Ultimate 4K Gaming Beast',
    author: 'TechMaster92',
    avatar: '👨‍💻',
    budget: '$3,500',
    fps: '240+ FPS',
    game: '4K Ultra',
    likes: 2847,
    views: 15420,
    comments: 342,
    difficulty: 'Expert',
    tags: ['Gaming', '4K', 'High-End'],
    badge: 'TRENDING',
  },
  {
    id: 2,
    title: 'Budget Streaming Powerhouse',
    author: 'StreamQueen',
    avatar: '👩‍🎤',
    budget: '$1,200',
    fps: '144 FPS',
    game: '1080p High',
    likes: 1923,
    views: 9845,
    comments: 156,
    difficulty: 'Beginner',
    tags: ['Streaming', 'Budget', 'Content Creator'],
    badge: 'POPULAR',
  },
  {
    id: 3,
    title: 'Compact Workstation Pro',
    author: 'DesignGuru',
    avatar: '🎨',
    budget: '$2,800',
    fps: 'N/A',
    game: '3D Rendering',
    likes: 1456,
    views: 7234,
    comments: 89,
    difficulty: 'Advanced',
    tags: ['Workstation', 'Rendering', 'Design'],
    badge: 'NEW',
  },
  {
    id: 4,
    title: 'RGB Dream Machine',
    author: 'RGBFanatic',
    avatar: '🌈',
    budget: '$4,200',
    fps: '200+ FPS',
    game: '4K High',
    likes: 3124,
    views: 19876,
    comments: 521,
    difficulty: 'Expert',
    tags: ['Gaming', 'RGB', 'Enthusiast'],
    badge: 'VIRAL',
  },
];

const communityStories = [
  {
    step: 1,
    title: 'Share Your Build',
    description: 'Submit your custom PC build with specifications, photos, and performance data',
  },
  {
    step: 2,
    title: 'Get Feedback',
    description: 'Receive detailed comments and suggestions from thousands of expert builders',
  },
  {
    step: 3,
    title: 'Help Others',
    description: 'Answer questions and share tips that help newcomers optimize their builds',
  },
  {
    step: 4,
    title: 'Earn Recognition',
    description: 'Get badges, awards, and featured placements for top contributions',
  },
];

export default function CommunityPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  return (
    <PageLayout
      title="Join the PC Builder Community"
      description="Connect with 50K+ enthusiasts, share builds, get expert advice, and become part of something amazing"
      maxWidth="7xl"
    >
      {/* Stats Section */}
      <motion.section
        className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatCard value={stat.value} label={stat.label} icon={<stat.icon size={24} />} />
          </motion.div>
        ))}
      </motion.section>

      {/* Featured Builds */}
      <motion.section className="mb-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl font-bold text-text-primary">
              Featured Builds
            </h2>
            <p className="text-text-muted mt-2">Inspiring PCs from our community</p>
          </div>
          <Link href="#all-builds">
            <PremiumButton icon={<ArrowRight size={18} />}>
              View All
            </PremiumButton>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {featuredBuilds.map((build, index) => (
            <Reveal key={build.id} delay={index * 0.1}>
              <PremiumCard variant={index === 3 ? 'accent' : 'gradient'} className="overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl">
                      {build.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary text-lg">
                        {build.title}
                      </h3>
                      <p className="text-text-muted text-sm">by @{build.author}</p>
                    </div>
                  </div>
                  <AnimatedBadge variant="neon" animated={build.badge === 'VIRAL'}>
                    {build.badge}
                  </AnimatedBadge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 p-4 rounded-lg bg-surface-2/30 border border-border/10">
                  <div>
                    <div className="text-2xl font-bold text-accent">{build.fps}</div>
                    <div className="text-xs text-text-muted">{build.game}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">{build.budget}</div>
                    <div className="text-xs text-text-muted">Budget</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{build.difficulty}</div>
                    <div className="text-xs text-text-muted">Difficulty</div>
                  </div>
                </div>

                <div className="flex gap-2 mb-4 flex-wrap">
                  {build.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedTag === tag
                          ? 'bg-accent/30 text-accent border border-accent/50'
                          : 'bg-surface-1/40 text-text-muted border border-border/10 hover:border-border/30'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/10 text-sm text-text-muted">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      <Heart size={16} className="text-red-400" />
                      {build.likes.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={16} className="text-blue-400" />
                      {build.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={16} className="text-purple-400" />
                      {build.comments}
                    </div>
                  </div>
                  <PremiumButton variant="ghost" size="sm" icon={<Download size={16} />}>
                    Use
                  </PremiumButton>
                </div>
              </PremiumCard>
            </Reveal>
          ))}
        </div>
      </motion.section>

      {/* Community Features */}
      <motion.section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">
          Why Join ZenPC Community?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Share2,
              title: 'Share & Inspire',
              description: 'Showcase your builds to thousands of PC enthusiasts worldwide',
            },
            {
              icon: MessageSquare,
              title: 'Learn & Grow',
              description: 'Get expert advice from experienced builders and troubleshoot issues',
            },
            {
              icon: Trophy,
              title: 'Earn Recognition',
              description: 'Get badges, achievements, and featured spots for top contributions',
            },
            {
              icon: Users,
              title: 'Find Friends',
              description: 'Connect with like-minded builders and form gaming/work groups',
            },
            {
              icon: TrendingUp,
              title: 'Discover Trends',
              description: 'Stay updated on the latest components, deals, and building techniques',
            },
            {
              icon: Zap,
              title: 'Get Support',
              description: '24/7 access to community experts ready to help you optimize',
            },
          ].map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={<feature.icon size={32} className="text-accent" />}
              title={feature.title}
              description={feature.description}
              gradient
            />
          ))}
        </div>
      </motion.section>

      {/* Community Journey */}
      <motion.section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">
          Your Journey in Our Community
        </h2>
        <div className="max-w-2xl mx-auto">
          {communityStories.map((story, i) => (
            <TimelineItem
              key={story.step}
              step={story.step}
              title={story.title}
              description={story.description}
              isLast={i === communityStories.length - 1}
            />
          ))}
        </div>
      </motion.section>

      {/* Leaderboard Preview */}
      <motion.section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">
          Community Champions
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { rank: 1, name: 'TechGuru42', points: '12,450', badge: 'Master Builder', icon: '👑' },
            { rank: 2, name: 'BuildLegend', points: '11,230', badge: 'Expert', icon: '🏆' },
            { rank: 3, name: 'PCWizard', points: '10,890', badge: 'Expert', icon: '⭐' },
          ].map((member) => (
            <PremiumCard key={member.name} variant="accent" className="text-center p-6">
              <div className="text-5xl mb-4">{member.icon}</div>
              <div className="text-2xl font-bold text-text-primary mb-1">#{member.rank}</div>
              <h3 className="font-semibold text-text-primary mb-2">{member.name}</h3>
              <div className="mb-3">
                <AnimatedBadge variant="success">{member.badge}</AnimatedBadge>
              </div>
              <div className="text-2xl font-bold text-accent">{member.points} pts</div>
            </PremiumCard>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.div
        className="card-gradient p-12 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Crown size={48} className="mx-auto mb-4 text-accent" />
        <h3 className="font-display text-3xl font-bold text-text-primary mb-4">
          Ready to Share Your Build?
        </h3>
        <p className="text-text-muted max-w-lg mx-auto mb-8">
          Join thousands of builders who are building, sharing, and learning together. Your next great build is waiting.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <PremiumButton
            variant="primary"
            onClick={() => window.location.href = '/builder'}
            icon={<Flame size={20} />}
          >
            Create Your Build
          </PremiumButton>
          <PremiumButton
            variant="secondary"
            onClick={() => window.location.href = '/login'}
            icon={<ArrowRight size={20} />}
          >
            Sign In & Join
          </PremiumButton>
        </div>
      </motion.div>
    </PageLayout>
  );
}
