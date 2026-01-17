'use client';

import { Suspense } from 'react';
import UnifiedBuilder from '@/components/builder/UnifiedBuilder';

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    }>
      <UnifiedBuilder />
    </Suspense>
  );
}
