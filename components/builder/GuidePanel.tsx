'use client';

import React, { useState } from 'react';

interface GuidePanelProps {
  selectedParts: Record<string, any>;
}

export default function GuidePanel({ selectedParts }: GuidePanelProps) {
  const [activeStep, setActiveStep] = useState(1);

  const buildSteps = [
    {
      id: 1,
      title: 'Planning & Preparation',
      description: 'Define your budget, use case, and performance requirements',
      icon: '📋',
      tips: [
        'Set a realistic budget including all components',
        'Consider your primary use (gaming, work, content creation)',
        'Check for software compatibility requirements',
        'Plan for future upgrades'
      ]
    },
    {
      id: 2,
      title: 'CPU Selection',
      description: 'Choose the processor that matches your workload',
      icon: '🔧',
      tips: [
        'Match CPU power to your intended use case',
        'Consider core count and clock speed',
        'Check compatibility with motherboard socket',
        'Leave room in budget for GPU if needed'
      ]
    },
    {
      id: 3,
      title: 'Motherboard & Power',
      description: 'Select a compatible motherboard and adequate power supply',
      icon: '🔌',
      tips: [
        'Ensure socket compatibility with your CPU',
        'Plan PSU wattage based on total system power draw',
        'Add 20-30% headroom to PSU wattage',
        'Choose reputable PSU brands for reliability'
      ]
    },
    {
      id: 4,
      title: 'Memory & Storage',
      description: 'Add RAM and storage drives for optimal performance',
      icon: '💾',
      tips: [
        'Minimum 16GB RAM for most modern workloads',
        'Use at least one SSD for OS and applications',
        'Add secondary storage for files and media',
        'Match RAM speed to motherboard specifications'
      ]
    },
    {
      id: 5,
      title: 'GPU & Performance',
      description: 'Select a graphics card suited to your needs',
      icon: '🎮',
      tips: [
        'GPU choice depends heavily on use case',
        'Gaming needs vary by target resolution and FPS',
        'Professional work may benefit from specialized GPUs',
        'Ensure adequate power supply for high-end GPUs'
      ]
    },
    {
      id: 6,
      title: 'Cooling & Case',
      description: 'Choose appropriate cooling and chassis',
      icon: '❄️',
      tips: [
        'Air cooling is sufficient for most builds',
        'Liquid cooling for high-end or overclocking systems',
        'Ensure case has adequate airflow',
        'Verify component clearances before purchasing'
      ]
    },
    {
      id: 7,
      title: 'Assembly & Testing',
      description: 'Build and test your system',
      icon: '🔨',
      tips: [
        'Follow motherboard manual for component placement',
        'Install components in correct order',
        'Test system before final assembly',
        'Apply thermal paste correctly',
        'Document your build for future reference'
      ]
    }
  ];

  const currentStep = buildSteps.find(s => s.id === activeStep);

  return (
    <div className="space-y-6">
      {/* Step Progress */}
      <div className="grid grid-cols-7 gap-2">
        {buildSteps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`
              aspect-square rounded-lg font-medium text-sm transition-all duration-200 ease-premium flex items-center justify-center
              ${
                activeStep === step.id
                  ? 'bg-accent text-white shadow-lg scale-105'
                  : 'bg-surface-1/55 backdrop-blur-glass text-text-muted hover:bg-surface-1/75 border border-border/10 shadow-glass'
              }
            `}
          >
            <span>{step.icon}</span>
          </button>
        ))}
      </div>

      {/* Step Content */}
      {currentStep && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentStep.icon}</span>
              <div>
                <h2 className="font-display text-3xl font-semibold text-text-primary">
                  {currentStep.title}
                </h2>
                <p className="text-text-muted mt-1">{currentStep.description}</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStep.tips.map((tip, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass group"
              >
                <div className="flex gap-3">
                  <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200">💡</span>
                  <p className="text-sm text-text-primary leading-relaxed">{tip}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
              className={`
                px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ease-premium
                ${
                  activeStep === 1
                    ? 'bg-surface-2/30 text-text-muted/50 cursor-not-allowed'
                    : 'bg-surface-1/55 backdrop-blur-glass text-text-primary hover:bg-surface-1/75 border border-border/10 shadow-glass active:scale-95'
                }
              `}
            >
              ← Previous
            </button>
            <div className="text-sm text-text-muted">
              Step {activeStep} of {buildSteps.length}
            </div>
            <button
              onClick={() => setActiveStep(Math.min(buildSteps.length, activeStep + 1))}
              disabled={activeStep === buildSteps.length}
              className={`
                px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ease-premium
                ${
                  activeStep === buildSteps.length
                    ? 'bg-surface-2/30 text-text-muted/50 cursor-not-allowed'
                    : 'bg-accent text-white hover:bg-accent/90 shadow-lg hover:shadow-xl active:scale-95'
                }
              `}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
