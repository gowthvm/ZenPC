'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import { Calendar } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using ZenPC, you agree to be bound by these Terms of Service. 
    If you do not agree to these terms, please do not use our services.`,
  },
  {
    title: '2. Use License',
    content: `Permission is granted to temporarily access and use ZenPC for personal, 
    non-commercial purposes. This license does not include reselling or commercial use 
    of any content or services.`,
  },
  {
    title: '3. User Accounts',
    content: `You are responsible for maintaining the confidentiality of your account credentials 
    and for all activities that occur under your account. You must notify us immediately 
    of any unauthorized use.`,
  },
  {
    title: '4. Intellectual Property',
    content: `All content, features, and functionality of ZenPC are owned by us and are 
    protected by copyright, trademark, and other intellectual property laws.`,
  },
  {
    title: '5. Limitation of Liability',
    content: `ZenPC is provided "as is" without any warranties. We shall not be liable for 
    any indirect, incidental, special, or consequential damages arising from your use of 
    our services.`,
  },
  {
    title: '6. Modifications',
    content: `We reserve the right to modify these terms at any time. We will notify users 
    of any material changes via email or through the service itself.`,
  },
  {
    title: '7. Governing Law',
    content: `These terms shall be governed by and construed in accordance with the laws 
    of the State of California, without regard to its conflict of law provisions.`,
  },
];

export default function TermsPage() {
  return (
    <PageLayout title="Terms of Service" description="Please read these terms carefully before using ZenPC">
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

        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.08 }}
              className="p-6 rounded-xl bg-surface-1/40 border border-border/10"
            >
              <h2 className="font-display text-lg font-bold text-text-primary mb-3">{section.title}</h2>
              <p className="text-text-muted leading-relaxed text-sm">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageLayout>
  );
}
