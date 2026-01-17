'use client';

import { ComprehensiveBuildGuide } from '@/components/builder/ComprehensiveBuildGuide';

export default function GuidePage() {
  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="section-header mb-12">
        <h1 className="section-title text-4xl">Build Guide</h1>
        <p className="section-subtitle text-lg">
          End-to-end PC building guidance with expert recommendations and real-time insights
        </p>
      </div>
      
      {/* Guide Component */}
      <ComprehensiveBuildGuide />
    </div>
  );
}
