'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import { CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';

const services = [
  { name: 'PC Builder', status: 'operational', uptime: '99.99%' },
  { name: 'API', status: 'operational', uptime: '99.98%' },
  { name: 'User Authentication', status: 'operational', uptime: '99.99%' },
  { name: 'Price Tracking', status: 'operational', uptime: '99.95%' },
  { name: 'Build Storage', status: 'operational', uptime: '99.99%' },
  { name: 'Compatibility Engine', status: 'operational', uptime: '99.97%' },
];

const incidents = [
  {
    date: 'Jan 10, 2024',
    title: 'Scheduled Maintenance Completed',
    description: 'Database optimization completed successfully with zero downtime.',
    status: 'resolved',
  },
  {
    date: 'Jan 5, 2024',
    title: 'Price API Latency',
    description: 'Brief increase in response times for price data. Issue resolved.',
    status: 'resolved',
  },
];

export default function StatusPage() {
  return (
    <PageLayout title="System Status" description="Real-time status of ZenPC services">
      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12 p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <h2 className="font-display text-2xl font-bold text-green-400">All Systems Operational</h2>
        </div>
        <p className="text-text-muted">Last checked: Just now</p>
      </motion.div>

      {/* Services */}
      <motion.section className="mb-12">
        <h2 className="font-display text-xl font-bold text-text-primary mb-6">Services</h2>
        <div className="space-y-3">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-surface-1/40 border border-border/10"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-text-primary font-medium">{service.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-text-muted text-sm">{service.uptime} uptime</span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                  Operational
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recent Incidents */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-xl font-bold text-text-primary mb-6">Recent Incidents</h2>
        <div className="space-y-4">
          {incidents.map((incident, index) => (
            <motion.div
              key={incident.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-surface-1/40 border border-border/10"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-text-primary">{incident.title}</h3>
                <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs">
                  Resolved
                </span>
              </div>
              <p className="text-text-muted text-sm mb-2">{incident.description}</p>
              <div className="flex items-center gap-1 text-text-muted/70 text-xs">
                <Clock className="w-3 h-3" />
                {incident.date}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </PageLayout>
  );
}
