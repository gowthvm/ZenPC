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
    {
      id: 2,
      title: 'Component Selection',
      description: 'Choose compatible components that meet your requirements',
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
      tips: [
        'Start with CPU and motherboard compatibility',
        'Ensure RAM speed matches motherboard support',
        'Check power supply wattage requirements',
        'Verify case compatibility with GPU size'
      ]
    },
    {
      id: 3,
      title: 'Assembly',
      description: 'Step-by-step physical assembly of your PC',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      tips: [
        'Install CPU and RAM on motherboard first',
        'Mount motherboard in case carefully',
        'Install GPU and storage drives',
        'Connect all power cables properly',
        'Manage cables for optimal airflow'
      ]
    },
    {
      id: 4,
      title: 'Software Setup',
      description: 'Install OS, drivers, and essential software',
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      tips: [
        'Create bootable USB drive with OS installer',
        'Install motherboard chipset drivers',
        'Update GPU drivers to latest version',
        'Install essential software and utilities',
        'Configure BIOS/UEFI settings'
      ]
    },
    {
      id: 5,
      title: 'Testing & Optimization',
      description: 'Benchmark performance and optimize settings',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      tips: [
        'Run stress tests to check stability',
        'Monitor temperatures under load',
        'Benchmark gaming or work performance',
        'Optimize fan curves and cooling',
        'Fine-tune overclocking if desired'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-text-primary">Build Guide</h1>
        <p className="text-lg text-text-muted max-w-3xl mx-auto">
          Step-by-step instructions to build your perfect PC from scratch
        </p>
      </div>

      {/* Step Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {buildSteps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeStep === step.id
                ? 'bg-accent text-white'
                : 'bg-surface-2/60 text-text-primary hover:bg-surface-2/80'
            }`}
          >
            Step {step.id}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="card p-8">
        {buildSteps.map((step) => (
          activeStep === step.id && (
            <div key={step.id} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-text-primary">
                    Step {step.id}: {step.title}
                  </h2>
                  <p className="text-text-muted">{step.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-text-primary">Key Tips:</h3>
                <ul className="space-y-3">
                  {step.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-accent"></div>
                      </div>
                      <span className="text-text-primary">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-border/10">
                <button
                  onClick={() => setActiveStep(Math.max(1, step.id - 1))}
                  disabled={step.id === 1}
                  className="px-6 py-3 rounded-lg border border-border text-text-primary font-medium hover:border-text-primary transition-all duration-200 hover:bg-surface-2/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous Step
                </button>
                <button
                  onClick={() => setActiveStep(Math.min(buildSteps.length, step.id + 1))}
                  disabled={step.id === buildSteps.length}
                  className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step.id === buildSteps.length ? 'Complete' : 'Next Step'}
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-4 text-text-primary">Need Help?</h3>
          <p className="text-text-muted mb-4">Check out our compatibility tool to ensure your components work together.</p>
          <Link 
            href="/app/builder" 
            className="px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors inline-block"
          >
            Use Builder Tool
          </Link>
        </div>
        
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-4 text-text-primary">Video Tutorials</h3>
          <p className="text-text-muted mb-4">Watch step-by-step video guides for visual learners.</p>
          <button className="px-4 py-2 rounded-lg border border-border text-text-primary font-medium hover:border-text-primary transition-colors">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
