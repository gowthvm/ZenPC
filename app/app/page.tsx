"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBuilderStore } from "@/store/builder";

const quickActions = [
  {
    label: "Start New Build",
    href: "/app/builder",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
    ),
  },
  {
    label: "Browse Presets",
    href: "/app/guide",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 4v16l7-4 7 4V4" /></svg>
    ),
  },
];

const guidanceTips = [
  {
    key: "psu",
    text: "Your PSU is the next recommended component.",
    relevant: (selected: any) => selected && !selected.psu,
  },
  {
    key: "storage",
    text: "Consider adding storage for better performance.",
    relevant: (selected: any) => selected && !selected.storage,
  },
  // Add more tips as needed
];

export default function Dashboard() {
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
        id: "1",
        name: "Gaming Beast",
        budget: 1500,
        parts: { cpu: { name: "AMD Ryzen 5 7600", price: 200 }, gpu: { name: "NVIDIA RTX 4070", price: 600 } },
        createdAt: new Date("2024-01-15"),
        compatible: true,
        updatedAt: new Date("2024-01-17"),
      },
      {
        id: "2",
        name: "Office Workstation",
        budget: 800,
        parts: { cpu: { name: "Intel Core i5-12400", price: 180 }, gpu: { name: "AMD Radeon RX 6600", price: 300 } },
        createdAt: new Date("2024-01-10"),
        compatible: true,
        updatedAt: new Date("2024-01-13"),
      },
    ];
    setSavedBuilds(mockBuilds);
  }, []);

  const currentBudget = Object.values(selected).reduce((sum, part) => sum + (part?.price || 0), 0);
  const mostRecentBuild = savedBuilds.length > 0 ? savedBuilds[0] : null;
  const buildCount = mostRecentBuild ? Object.keys(mostRecentBuild.parts).length : 0;
  const compatibility = mostRecentBuild ? (mostRecentBuild.compatible ? "All Clear" : "Needs Attention") : "-";
  const progress = mostRecentBuild ? Math.round((buildCount / 8) * 100) : 0; // Assume 8 parts max
  const guidance = guidanceTips.find((tip) => tip.relevant(selected));

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="font-display text-4xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Your PC building journey starts here.
          </p>
        </div>
        <div className="mt-12 animate-pulse text-accent text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="section-header mb-8">
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle">Track your builds and continue where you left off</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Continue Your Build - Featured Card */}
        <section className="lg:col-span-5 panel group hover:scale-[1.02] transition-all duration-base ease-premium">
          <div className="space-y-4">
            <h2 className="section-title text-xl">Continue Your Build</h2>
            
            {mostRecentBuild ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-surface-1/40 rounded-lg border border-border/10">
                    <p className="text-xs uppercase tracking-wider font-semibold text-text-muted mb-1">Build Name</p>
                    <p className="text-lg font-semibold text-accent">{mostRecentBuild.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-surface-1/40 rounded-lg border border-border/10">
                      <p className="text-xs uppercase tracking-wider font-semibold text-text-muted mb-1">Last Updated</p>
                      <p className="font-semibold text-sm text-text-primary">{mostRecentBuild.updatedAt.toLocaleDateString()}</p>
                    </div>
                    <div className="p-4 bg-surface-1/40 rounded-lg border border-border/10">
                      <p className="text-xs uppercase tracking-wider font-semibold text-text-muted mb-1">Total</p>
                      <p className="font-semibold text-sm text-accent">${mostRecentBuild.budget}</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/app/builder"
                  className="btn-primary w-full text-center mt-6 py-3 font-semibold hover:shadow-xl hover:shadow-accent/25"
                >
                  Continue Building
                </Link>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon bg-surface-1/50">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="empty-state-text">No active builds yet. Start creating your first PC build.</p>
                <Link href="/app/builder" className="btn-primary">
                  Start Building
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions Sidebar */}
        <section className="lg:col-span-3 space-y-6">
          {/* Quick Actions */}
          <div className="panel">
            <h3 className="section-title text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="nav-item nav-item-inactive w-full justify-start group"
                >
                  <span className="text-text-muted group-hover:text-accent transition-colors duration-base flex-shrink-0">
                    {action.icon}
                  </span>
                  <span>{action.label}</span>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-base ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Helpful Guidance */}
          {guidance && (
            <div className="panel bg-gradient-to-br from-accent/10 via-surface-1/30 to-purple-600/5 border-accent/20">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-accent mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-accent mb-1">Tip</p>
                  <p className="text-sm text-text-muted">{guidance.text}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Build Summary */}
        <section className="lg:col-span-4 panel group hover:scale-[1.02] transition-all duration-base ease-premium">
          <h3 className="section-title text-xl mb-6">Build Overview</h3>
          
          {mostRecentBuild ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-1/30 rounded-lg border border-border/10">
                  <span className="text-sm text-text-muted">Components</span>
                  <span className="font-semibold text-lg text-text-primary">{buildCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-1/30 rounded-lg border border-border/10">
                  <span className="text-sm text-text-muted">Status</span>
                  <span className={`font-semibold text-sm ${compatibility === "All Clear" ? "text-green-400" : "text-yellow-400"}`}>
                    {compatibility === "All Clear" ? "✓ Compatible" : "⚠ Review"}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-text-muted">Completion</span>
                  <span className="font-semibold text-sm text-accent">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-surface-1/40 rounded-full overflow-hidden border border-border/10">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-purple-600 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state py-8">
              <p className="empty-state-text">No builds yet</p>
              <Link href="/app/builder" className="btn-primary text-sm">
                Create Build
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Saved Builds Section */}
      <div className="section-header">
        <h2 className="section-title">Saved Builds</h2>
        <p className="section-subtitle">All your PC builds in one place</p>
      </div>

      {savedBuilds.length > 0 ? (
        <div className="content-grid-3">
          {savedBuilds.map((build) => (
            <div
              key={build.id}
              className="panel group hover:scale-[1.05] hover:shadow-lg transition-all duration-base ease-premium cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/10">
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors duration-base">
                    {build.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-1">Created {build.createdAt.toLocaleDateString()}</p>
                </div>
                <div className={build.compatible ? 'badge-success' : 'badge-warning'}>
                  {build.compatible ? '✓ OK' : '⚠ Issues'}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Budget</span>
                  <span className="font-semibold text-accent">${build.budget}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Parts</span>
                  <span className="font-semibold text-text-primary">{Object.keys(build.parts).length} items</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/10">
                <button className="w-full btn-secondary text-sm py-2">
                  View Build
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="panel text-center">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="empty-state-title">No Saved Builds</h3>
            <p className="empty-state-text">Start building your first PC to see it here</p>
            <Link href="/app/builder" className="btn-primary">
              Create New Build
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

