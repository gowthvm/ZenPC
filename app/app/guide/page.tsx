'use client';

import { ComprehensiveBuildGuide } from '@/components/builder/ComprehensiveBuildGuide';

export default function GuidePage() {
  return (
    <div className="w-full py-10">
      <div className="text-center space-y-4 mb-8">
        <h1 className="font-display text-4xl font-bold text-text-primary">Comprehensive Build Guide</h1>
        <p className="text-lg text-text-muted max-w-3xl mx-auto">
          Your end-to-end PC building authority with dynamic, data-driven guidance for every phase
        </p>
      </div>
      
      <ComprehensiveBuildGuide />
    </div>
  );
}
