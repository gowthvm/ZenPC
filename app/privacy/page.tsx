'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import { Calendar } from 'lucide-react';

const sections = [
  {
    title: 'Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, 
    save a build, or contact us for support. This includes your email address, username, 
    and any build configurations you create.`,
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect to provide, maintain, and improve our services, 
    process transactions, send you technical notices and support messages, and respond to 
    your comments and questions.`,
  },
  {
    title: 'Information Sharing',
    content: `We do not sell, trade, or otherwise transfer your personal information to third parties. 
    We may share aggregated, non-personal information with partners for analytics and 
    service improvement purposes.`,
  },
  {
    title: 'Data Security',
    content: `We implement appropriate security measures to protect your personal information. 
    All data is encrypted in transit using TLS and at rest using AES-256 encryption.`,
  },
  {
    title: 'Your Rights',
    content: `You have the right to access, correct, or delete your personal information at any time 
    through your account settings. You can also request a full export of your data.`,
  },
  {
    title: 'Cookies',
    content: `We use cookies and similar technologies to improve your experience, understand usage 
    patterns, and deliver relevant content. You can control cookie preferences through your browser.`,
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at privacy@zenpc.com.`,
  },
];

export default function PrivacyPage() {
  return (
    <PageLayout title="Privacy Policy" description="How we collect, use, and protect your information">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-2 text-text-muted text-sm mb-8 justify-center">
          <Calendar className="w-4 h-4" />
          Last updated: January 15, 2024
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 rounded-xl bg-surface-1/40 border border-border/10"
            >
              <h2 className="font-display text-xl font-bold text-text-primary mb-4">{section.title}</h2>
              <p className="text-text-muted leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageLayout>
  );
}
