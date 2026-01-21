'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

const featuredPost = {
  title: 'The Ultimate Guide to Building a Gaming PC in 2024',
  excerpt: 'Everything you need to know about selecting components, managing your budget, and getting the best performance for your money.',
  date: 'Jan 15, 2024',
  readTime: '12 min read',
  category: 'Guides',
  image: '🎮',
};

const blogPosts = [
  {
    title: 'RTX 5090 vs RTX 4090: Is It Worth the Upgrade?',
    excerpt: 'We compare the latest generation GPUs to help you decide if it\'s time to upgrade.',
    date: 'Jan 12, 2024',
    readTime: '8 min read',
    category: 'Reviews',
  },
  {
    title: 'How to Choose the Right Power Supply',
    excerpt: 'A comprehensive PSU buying guide covering efficiency, wattage, and modularity.',
    date: 'Jan 10, 2024',
    readTime: '6 min read',
    category: 'Guides',
  },
  {
    title: 'DDR5 RAM: Everything You Need to Know',
    excerpt: 'Understanding the new memory standard and whether it\'s right for your build.',
    date: 'Jan 8, 2024',
    readTime: '7 min read',
    category: 'Tech',
  },
  {
    title: 'Budget Build Challenge: $800 Gaming PC',
    excerpt: 'We put together the best possible gaming PC for under $800. Here\'s what we picked.',
    date: 'Jan 5, 2024',
    readTime: '10 min read',
    category: 'Builds',
  },
  {
    title: 'Cable Management 101: Tips and Tricks',
    excerpt: 'Transform your build from messy to masterpiece with these cable management techniques.',
    date: 'Jan 3, 2024',
    readTime: '5 min read',
    category: 'Tips',
  },
];

const categories = ['All', 'Guides', 'Reviews', 'Builds', 'Tech', 'Tips'];

export default function BlogPage() {
  return (
    <PageLayout
      title="Blog"
      description="News, guides, reviews, and tips from the ZenPC team"
      maxWidth="6xl"
    >
      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-12"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${index === 0
                ? 'bg-accent text-white'
                : 'bg-surface-1/40 text-text-muted hover:text-text-primary hover:bg-surface-2/50 border border-border/10'
              }`}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Featured Post */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <Link href="#" className="block group">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-purple-600/5 to-cyan-600/10 border border-border/10 hover:border-accent/30 transition-all">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="text-8xl">{featuredPost.image}</div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="text-text-muted text-sm flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </span>
                  <span className="text-text-muted text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  {featuredPost.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-accent font-medium">
                  Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.section>

      {/* Posts Grid */}
      <motion.section>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-8">
          Latest Articles
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link href="#" className="block h-full group">
                <div className="h-full p-6 rounded-2xl bg-surface-1/40 border border-border/10 hover:border-accent/30 transition-all flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 rounded-md bg-surface-2/50 text-text-muted text-xs flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                    <span className="text-text-muted/70 text-xs">{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-text-muted text-sm mb-4 flex-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted/70 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                    <ArrowRight className="w-4 h-4 text-text-muted/50 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </PageLayout>
  );
}
