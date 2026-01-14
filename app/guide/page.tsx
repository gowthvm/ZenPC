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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-text-primary">Build Guide</h1>
        <p className="text-lg text-text-muted max-w-3xl mx-auto">
          Step-by-step instructions to build your perfect PC from scratch
        </p>
      </div>
      {/* ...rest of code unchanged... */}
    </div>
  );
}
