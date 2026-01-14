'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/store/builder';

export default function AppPage() {
  const { selected } = useBuilderStore();
  const [savedBuilds, setSavedBuilds] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock saved builds data
  useEffect(() => {
    const mockBuilds = [
      {
        id: '1',
        name: 'Gaming Beast',
        budget: 1500,
        parts: { cpu: { name: 'AMD Ryzen 5 7600', price: 200 }, gpu: { name: 'NVIDIA RTX 4070', price: 600 } },
        createdAt: new Date('2024-01-15'),
        compatible: true
      },
      {
        id: '2', 
        name: 'Office Workstation',
        budget: 800,
        parts: { cpu: { name: 'Intel Core i5-12400', price: 180 }, gpu: { name: 'AMD Radeon RX 6600', price: 300 } },
        createdAt: new Date('2024-01-10'),
        compatible: true
      }
    ];
    setSavedBuilds(mockBuilds);
  }, []);

  const currentBudget = Object.values(selected).reduce((sum, part) => sum + (part?.price || 0), 0);

  if (!isClient) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-display text-4xl font-bold text-text-primary">My Builds</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Manage your PC builds, start new projects, and track your progress
          </p>
        </div>
        <div className="text-center py-12">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-text-primary">My Builds</h1>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          Manage your PC builds, start new projects, and track your progress
        </p>
      </div>

      {/* Current Build Status */}
      {Object.keys(selected).length > 0 && (
        <div className="card p-6">
          <h2 className="font-display text-2xl font-bold mb-4 text-text-primary">Current Build</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">${currentBudget}</div>
              <div className="text-sm text-text-muted">Current Budget</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-text-primary">{Object.keys(selected).length}</div>
              <div className="text-sm text-text-muted">Parts Selected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">In Progress</div>
              <div className="text-sm text-text-muted">Status</div>
            </div>
          </div>
          <div className="flex gap-4 mt-6 justify-center">
            <Link 
              href="/app/builder" 
              className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Continue Building
            </Link>
            <button className="px-6 py-3 rounded-lg border border-border text-text-primary font-medium hover:border-text-primary transition-all duration-200 hover:bg-surface-2/30">
              Save Build
            </button>
          </div>
        </div>
      )}

      {/* Saved Builds */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-text-primary">Saved Builds</h2>
        {savedBuilds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedBuilds.map((build) => (
              <div key={build.id} className="card p-6 hover:scale-105 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-text-primary">{build.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    build.compatible 
                      ? 'bg-green-400/20 text-green-400' 
                      : 'bg-red-400/20 text-red-400'
                  }`}>
                    {build.compatible ? 'Compatible' : 'Issues'}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Budget:</span>
                    <span className="font-semibold text-accent">${build.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Parts:</span>
                    <span className="font-semibold">{Object.keys(build.parts).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Created:</span>
                    <span className="font-semibold">{build.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors">
                    Load
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg border border-border text-text-primary text-sm font-medium hover:border-text-primary transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-text-primary mb-2">No Saved Builds</h3>
            <p className="text-text-muted mb-6">Start building your first PC to see it here</p>
            <Link 
              href="/app/builder" 
              className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Start Building
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
