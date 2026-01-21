'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import { Check, Sparkles, Zap, Shield } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with PC building',
    features: [
      'Basic PC builder',
      'Compatibility checking',
      'Save up to 3 builds',
      'Community access',
      'Email support',
    ],
    cta: 'Get Started',
    href: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For enthusiasts who want the full experience',
    features: [
      'Everything in Free',
      'Unlimited saved builds',
      'AI recommendations',
      'Price tracking & alerts',
      'Build comparison tools',
      'Priority support',
      'Export to PDF/CSV',
    ],
    cta: 'Start Free Trial',
    href: '/register?plan=pro',
    popular: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: '/month',
    description: 'For businesses and professional builders',
    features: [
      'Everything in Pro',
      '5 team members',
      'Shared build library',
      'Custom branding',
      'API access',
      'Dedicated account manager',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
];

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, you can cancel your subscription at any time. No questions asked.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Pro plans come with a 14-day free trial. No credit card required.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, PayPal, and bank transfers for Team plans.',
  },
];

export default function PricingPage() {
  return (
    <PageLayout
      title="Simple, Transparent Pricing"
      description="Choose the plan that fits your needs. All plans include our core PC builder features."
    >
      {/* Plans Grid */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`relative p-8 rounded-2xl border transition-all ${plan.popular
                  ? 'bg-gradient-to-b from-accent/10 to-purple-600/5 border-accent/30 shadow-xl shadow-accent/10'
                  : 'bg-surface-1/40 backdrop-blur-xl border-border/10 hover:border-border/30'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent to-purple-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                  <span className="text-text-muted">{plan.period}</span>
                </div>
                <p className="text-text-muted text-sm mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-text-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={plan.href}
                  className={`block w-full py-3 rounded-xl text-center font-medium transition-all ${plan.popular
                      ? 'bg-gradient-to-r from-accent to-purple-600 text-white shadow-lg shadow-accent/25 hover:shadow-xl'
                      : 'bg-surface-2/50 text-text-primary border border-border/20 hover:bg-surface-2/80'
                    }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features comparison */}
      <motion.section
        className="mb-20 py-12 px-8 rounded-2xl bg-surface-1/40 backdrop-blur-xl border border-border/10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-2xl font-bold text-text-primary text-center mb-8">
          All Plans Include
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: 'Real-time Updates', description: 'Instant compatibility checks and live pricing' },
            { icon: Shield, title: 'Secure & Private', description: 'Your data is encrypted and never sold' },
            { icon: Sparkles, title: 'Regular Updates', description: 'New features and components added weekly' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">{feature.title}</h3>
              <p className="text-text-muted text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQs */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-2xl font-bold text-text-primary text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-surface-1/40 backdrop-blur-xl border border-border/10"
            >
              <h3 className="font-semibold text-text-primary mb-2">{faq.q}</h3>
              <p className="text-text-muted text-sm">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </PageLayout>
  );
}
