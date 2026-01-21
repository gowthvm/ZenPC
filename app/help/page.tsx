'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import { Book, FileText, Video, MessageCircle, Search, ArrowRight, ExternalLink } from 'lucide-react';

const helpCategories = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn the basics of using ZenPC to build your perfect PC',
    articles: ['Quick Start Guide', 'Understanding the Builder', 'Your First Build'],
    color: 'from-blue-500/20 to-cyan-600/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: FileText,
    title: 'Build Guides',
    description: 'Step-by-step tutorials for different build types',
    articles: ['Gaming PC Guide', 'Workstation Build', 'Budget Build Tips'],
    color: 'from-green-500/20 to-emerald-600/20',
    iconColor: 'text-green-400',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Visual guides to help you through the process',
    articles: ['Assembly Basics', 'Cable Management', 'BIOS Setup'],
    color: 'from-purple-500/20 to-violet-600/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: MessageCircle,
    title: 'Troubleshooting',
    description: 'Solutions to common issues and questions',
    articles: ['Compatibility Errors', 'Performance Issues', 'Part Selection'],
    color: 'from-amber-500/20 to-orange-600/20',
    iconColor: 'text-amber-400',
  },
];

const popularArticles = [
  'How to choose the right CPU for your needs',
  'Understanding GPU specifications',
  'RAM speed vs capacity: What matters more?',
  'PSU sizing guide: Don\'t underbuy',
  'SSD vs HDD: Making the right choice',
];

export default function HelpPage() {
  return (
    <PageLayout
      title="Help Center"
      description="Find answers, guides, and tutorials to help you build the perfect PC"
    >
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/50" />
          <input
            type="text"
            placeholder="Search for articles, guides, tutorials..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-1/40 border border-border/10 text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
          />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-text-primary mb-8">
          Browse by Category
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {helpCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 rounded-2xl bg-surface-1/40 border border-border/10 hover:border-accent/30 transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-text-primary">{category.title}</h3>
                  <p className="text-text-muted text-sm">{category.description}</p>
                </div>
              </div>
              <ul className="space-y-2 pl-16">
                {category.articles.map((article) => (
                  <li key={article}>
                    <Link href="#" className="text-sm text-text-muted hover:text-accent transition-colors flex items-center gap-2 group/link">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                      {article}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Popular Articles */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-2xl bg-surface-1/40 border border-border/10"
      >
        <h2 className="font-display text-xl font-bold text-text-primary mb-6">
          Popular Articles
        </h2>
        <ul className="space-y-3">
          {popularArticles.map((article, index) => (
            <motion.li
              key={article}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-2/50 transition-colors group">
                <span className="text-text-muted group-hover:text-text-primary transition-colors">{article}</span>
                <ExternalLink className="w-4 h-4 text-text-muted/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.section>
    </PageLayout>
  );
}
