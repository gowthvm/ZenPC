'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import {
  Check, Sparkles, Zap, Shield, ArrowRight, TrendingUp,
  Flame, Bolt, Trophy, Users, Infinity, Clock,
  BarChart3, Target, Crown, Rocket
} from 'lucide-react';
import {
  PremiumCard, FeatureCard, StatCard, PremiumButton,
  GradientText, AnimatedBadge, CtaBox, ComparisonTable
} from '@/components/ui/AdvancedComponents';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    icon: Zap,
    description: 'Perfect for casual builders exploring PC components',
    features: [
      { text: 'Basic PC builder interface', included: true },
      { text: 'Compatibility checking', included: true },
      { text: 'Save up to 3 builds', included: true },
      { text: 'Community access (read-only)', included: true },
      { text: 'Email support (24h response)', included: true },
      { text: 'Standard components database', included: true },
      { text: 'AI recommendations', included: false },
      { text: 'Price tracking', included: false },
      { text: 'Team features', included: false },
    ],
    cta: 'Get Started Free',
    href: '/register',
    popular: false,
    color: 'from-blue-500/20 to-cyan-600/10',
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    icon: Flame,
    description: 'For serious builders who want the complete experience',
    features: [
      { text: 'Everything in Starter', included: true },
      { text: 'Unlimited saved builds', included: true },
      { text: 'AI-powered recommendations', included: true },
      { text: 'Real-time price tracking', included: true },
      { text: 'Performance benchmarking', included: true },
      { text: 'Build comparison tools', included: true },
      { text: 'Export to PDF/CSV/JSON', included: true },
      { text: 'Priority support (2h response)', included: true },
      { text: 'Team features', included: false },
    ],
    cta: 'Start 14-Day Free Trial',
    href: '/register?plan=pro',
    popular: true,
    color: 'from-purple-500/30 to-pink-600/20',
    badge: 'MOST POPULAR',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    icon: Crown,
    description: 'For teams, businesses, and professional PC builders',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited team members', included: true },
      { text: 'Shared build library & workspaces', included: true },
      { text: 'Custom branding & white label', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'REST API access & webhooks', included: true },
      { text: '99.9% SLA guarantee', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom integrations & support', included: true },
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
    color: 'from-amber-500/20 to-orange-600/10',
  },
];

const stats = [
  { value: '50K+', label: 'Active Builders', icon: Users },
  { value: '1M+', label: 'PCs Built', icon: BarChart3 },
  { value: '$2.3B', label: 'Saved Together', icon: TrendingUp },
  { value: '100%', label: 'Accurate Checks', icon: Check },
];

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes! Cancel your Pro subscription anytime with one click. No hidden fees, no questions asked.',
  },
  {
    q: 'Is there really a free trial?',
    a: 'Yes, 14 days free. Upgrade to Pro to access AI recommendations, price tracking, and all premium features. No credit card required.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and bank transfers for Enterprise plans.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Absolutely. Upgrade or downgrade anytime. Changes take effect immediately, and we\'ll prorate any charges.',
  },
  {
    q: 'Do you offer discounts for annual billing?',
    a: 'Yes! Save 20% when you switch to annual billing. That\'s only $115/year for Pro (vs $144/year monthly).',
  },
  {
    q: 'What about team discounts?',
    a: 'For 3+ Pro users, we offer bulk discounts. Contact our sales team for a custom quote.',
  },
];

const comparisonItems = [
  { label: 'PC Builder', values: ['Basic', 'Advanced AI', 'Enterprise'] },
  { label: 'Saved Builds', values: ['3', 'Unlimited', 'Unlimited'] },
  { label: 'Price Tracking', values: ['No', '50+ Retailers', '50+ Retailers'] },
  { label: 'Performance Benchmarks', values: ['No', 'Real Data', 'Real Data'] },
  { label: 'Build Sharing', values: ['Community Only', 'Public & Private', 'Public & Private'] },
  { label: 'API Access', values: ['No', 'Read-Only', 'Full'] },
  { label: 'Support', values: ['Email', 'Priority Email', 'Dedicated Manager'] },
  { label: 'SLA Guarantee', values: ['No', 'No', 'Yes (99.9%)'] },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <PageLayout
      title="Transparent, Flexible Pricing"
      description="Choose the perfect plan for your PC building journey. Start free, upgrade anytime."
      maxWidth="7xl"
    >
      {/* Billing Toggle */}
      <motion.div
        className="flex items-center justify-center gap-4 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${billingCycle === 'monthly'
              ? 'bg-accent text-white'
              : 'bg-surface-1/40 text-text-muted hover:text-text-primary'
            }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle('annual')}
          className={`px-6 py-2 rounded-lg font-medium transition-all relative ${billingCycle === 'annual'
              ? 'bg-accent text-white'
              : 'bg-surface-1/40 text-text-muted hover:text-text-primary'
            }`}
        >
          Annual
          {billingCycle === 'annual' && (
            <AnimatedBadge variant="success" animated>
              Save 20%
            </AnimatedBadge>
          )}
        </button>
      </motion.div>

      {/* Stats Section */}
      <motion.section
        className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, staggerChildren: 0.1 }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <StatCard value={stat.value} label={stat.label} icon={<stat.icon size={24} />} />
          </motion.div>
        ))}
      </motion.section>

      {/* Plans Grid */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid md:grid-cols-3 gap-6 xl:gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.15 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <AnimatedBadge variant="neon" animated>
                      <Sparkles size={16} className="inline mr-1" />
                      {plan.badge}
                    </AnimatedBadge>
                  </div>
                )}

                <PremiumCard
                  variant={plan.popular ? 'accent' : 'gradient'}
                  className="h-full p-8 md:p-6 lg:p-8"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <Icon className="w-8 h-8 text-accent mb-3" />
                      <h3 className="font-display text-2xl font-bold text-text-primary">
                        {plan.name}
                      </h3>
                    </div>
                    {plan.popular && (
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <Trophy size={20} className="text-accent" />
                      </div>
                    )}
                  </div>

                  <p className="text-text-muted text-sm mb-6">{plan.description}</p>

                  <div className="mb-8 pb-8 border-b border-border/10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-text-primary">
                        {plan.price}
                      </span>
                      <span className="text-text-muted text-sm">
                        {plan.period}
                      </span>
                    </div>
                    {plan.period === '/month' && billingCycle === 'annual' && (
                      <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
                        <TrendingUp size={14} />
                        <span>Annual: $115.20/year (save $17.60)</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.text}
                        className={`flex items-start gap-3 text-sm ${feature.included ? 'text-text-primary' : 'text-text-muted/50'
                          }`}
                      >
                        <Check
                          size={18}
                          className={`flex-shrink-0 mt-0.5 ${feature.included ? 'text-green-400' : 'text-text-muted/30'
                            }`}
                        />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  <PremiumButton
                    variant={plan.popular ? 'primary' : 'secondary'}
                    fullWidth
                    onClick={() => window.location.href = plan.href}
                    icon={<ArrowRight size={18} />}
                  >
                    {plan.cta}
                  </PremiumButton>
                </PremiumCard>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Comparison Table */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">
          Detailed Feature Comparison
        </h2>
        <ComparisonTable items={comparisonItems} headers={['Starter', 'Pro', 'Enterprise']} />
      </motion.section>

      {/* Additional Features Section */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">
          All Plans Include
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Instant compatibility checks powered by advanced algorithms',
            },
            {
              icon: Shield,
              title: 'Bank-Level Security',
              description: 'Your data is encrypted end-to-end and never shared',
            },
            {
              icon: Sparkles,
              title: 'Weekly Updates',
              description: 'New components and features added constantly',
            },
            {
              icon: Users,
              title: 'Thriving Community',
              description: 'Connect with 50K+ PC builders and enthusiasts',
            },
            {
              icon: Clock,
              title: '24/7 Availability',
              description: 'Build anytime from anywhere, even offline',
            },
            {
              icon: Infinity,
              title: 'Forever Free',
              description: 'Starter plan never expires, no forced upgrades',
            },
          ].map((item, i) => (
            <FeatureCard
              key={item.title}
              icon={<item.icon size={32} />}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <h3 className="font-semibold text-text-primary mb-3 text-sm flex items-start gap-2">
                <Bolt size={18} className="text-accent flex-shrink-0 mt-0.5" />
                {faq.q}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <CtaBox
          title="Ready to Build Your Dream PC?"
          description="Join thousands of builders using ZenPC. Start for free, no credit card required."
          buttonText="Start Building Now"
          onButtonClick={() => window.location.href = '/builder'}
          icon={<Rocket size={48} />}
        />
      </motion.div>
    </PageLayout>
  );
}
