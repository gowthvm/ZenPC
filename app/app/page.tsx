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
    <div className="w-full py-10 space-y-12 animate-fade-in">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Continue Your Build */}
        <section className="lg:col-span-5 card p-8 flex flex-col justify-between">
          <h2 className="font-display text-2xl font-bold mb-4 text-text-primary">Continue Your Build</h2>
          {mostRecentBuild ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Build Name</span>
                  <span className="font-semibold text-lg text-accent">{mostRecentBuild.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Last Updated</span>
                  <span className="font-medium">{mostRecentBuild.updatedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Total Price</span>
                  <span className="font-semibold">${mostRecentBuild.budget}</span>
                </div>
              </div>
              <Link
                href="/app/builder"
                className="mt-8 w-full py-3 rounded-xl bg-accent text-white font-semibold text-lg hover:bg-accent/90 focus:ring-2 focus:ring-accent/50 transition-colors duration-200"
              >
                Continue Building
              </Link>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <div className="text-text-muted mb-2">No builds yet.</div>
              <Link
                href="/app/builder"
                className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors duration-200"
              >
                Start Building
              </Link>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold mb-4 text-text-primary">Quick Actions</h2>
            <div className="flex flex-col gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-3/60 hover:bg-accent/10 transition-colors duration-200 font-medium text-text-primary hover:text-accent group cursor-pointer"
                >
                  <span className="text-text-muted group-hover:text-accent transition-colors duration-200">
                    {action.icon}
                  </span>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Helpful Guidance */}
          {guidance && (
            <div className="bg-gradient-to-br from-accent/10 to-purple-600/10 rounded-2xl shadow border border-border/20 p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                <span className="font-semibold text-text-primary">Tip</span>
              </div>
              <p className="text-text-muted text-sm">{guidance.text}</p>
            </div>
          )}
        </section>

        {/* Build Summary Snapshot */}
        <section className="lg:col-span-4 card p-8 flex flex-col justify-between">
          <h2 className="font-display text-2xl font-bold mb-4 text-text-primary">Build Summary Snapshot</h2>
          {mostRecentBuild ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Component Count</span>
                <span className="font-semibold text-lg">{buildCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Compatibility</span>
                <span className={`font-semibold ${compatibility === "All Clear" ? "text-green-500" : "text-red-500"}`}>{compatibility}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Completion</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-surface-1/40 rounded-full h-3 mt-2">
                <div
                  className="bg-accent h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-text-muted text-center">
              <div>No build summary available yet.</div>
              <Link
                href="/app/builder"
                className="mt-4 px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors duration-200"
              >
                Start Building
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Saved Builds Section (below grid) */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold text-text-primary mb-6">Saved Builds</h2>
        {savedBuilds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedBuilds.map((build) => (
              <div
                key={build.id}
                className="card p-6 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-text-primary group-hover:text-accent transition-colors duration-200">
                    {build.name}
                  </h3>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      build.compatible ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400"
                    }`}
                  >
                    {build.compatible ? "Compatible" : "Issues"}
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
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-text-primary mb-2">No Saved Builds</h3>
            <p className="text-text-muted mb-6">Start building your first PC to see it here</p>
            <Link
              href="/app/builder"
              className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors duration-200"
            >
              Start Building
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

