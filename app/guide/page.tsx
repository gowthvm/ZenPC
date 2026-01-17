'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GuidePage() {
  const [activeStep, setActiveStep] = useState(1);

  const buildSteps = [
    {
      id: 1,
      title: 'Planning & Preparation',
      description: 'Define your budget, use case, and performance requirements',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      tips: [
        'Set a realistic budget including all components',
        'Consider your primary use (gaming, work, content creation)',
        'Check for software compatibility requirements',
        'Plan for future upgrades'
      ]
    },
    // ...rest of steps unchanged
  ];

  return (
    <div className="w-full animate-in fade-in duration-500 space-y-12">
      {/* Page Header */}
      <div className="section-header max-w-3xl mx-auto text-center">
        <h1 className="section-title text-4xl">PC Build Guide</h1>
        <p className="section-subtitle text-lg">
          Step-by-step instructions to build your perfect PC from scratch
        </p>
      </div>

      {/* Guide Steps */}
      <div className="space-y-8">
        {buildSteps.map((step) => (
          <div
            key={step.id}
            className={`panel cursor-pointer transition-all duration-base ease-premium group ${
              activeStep === step.id ? 'ring-2 ring-accent/40' : 'hover:scale-[1.02]'
            }`}
            onClick={() => setActiveStep(activeStep === step.id ? 0 : step.id)}
          >
            {/* Header */}
            <div className="flex items-start gap-4 pb-4 border-b border-border/10">
              <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-br from-accent/20 to-purple-600/20 border border-accent/20">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-semibold text-sm">
                    {step.id}
                  </span>
                  <h3 className="font-semibold text-lg text-text-primary group-hover:text-accent transition-colors duration-base">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-text-muted">{step.description}</p>
              </div>
              <svg
                className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform duration-base ${
                  activeStep === step.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Expanded Content */}
            {activeStep === step.id && (
              <div className="pt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">Key Considerations</h4>
                  <ul className="space-y-2">
                    {step.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-text-muted">
                        <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border/10">
                  <Link href="/app/builder" className="btn-primary inline-flex items-center gap-2 text-sm">
                    <span>Start Building</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 panel text-center bg-gradient-to-r from-accent/10 via-surface-1/30 to-purple-600/10 border-accent/20">
        <h2 className="font-display text-2xl font-semibold text-text-primary mb-3">Ready to Build?</h2>
        <p className="text-text-muted mb-6 max-w-2xl mx-auto">
          Use our interactive PC Builder to get expert recommendations and real-time compatibility checks for all your components.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/app/builder" className="btn-primary">
            Open PC Builder
          </Link>
          <Link href="/app" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
