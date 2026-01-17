'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { BuilderMode } from './UnifiedBuilder';
import { supabase } from '@/lib/supabaseClient';

interface SavedBuild {
  id: string;
  name: string;
  parts: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface BuilderSidebarProps {
  user: any;
  builds: SavedBuild[];
  onNewBuild: () => void;
  onLoadBuild: (build: SavedBuild) => void;
  onDeleteBuild: (buildId: string) => void;
  onDuplicateBuild: (build: SavedBuild) => void;
  activeMode: BuilderMode;
  onModeChange: (mode: BuilderMode) => void;
}

export default function BuilderSidebar({
  user,
  builds,
  onNewBuild,
  onLoadBuild,
  onDeleteBuild,
  onDuplicateBuild,
  activeMode,
  onModeChange,
}: BuilderSidebarProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navigationItems: Array<{ id: BuilderMode; label: string; icon: string }> = [
    { id: 'build', label: 'Build', icon: '⚙️' },
    { id: 'guide', label: 'Guide', icon: '📖' },
    { id: 'insights', label: 'Insights', icon: '📊' },
    { id: 'history', label: 'History', icon: '📁' },
    { id: 'profile', label: 'Account', icon: '👤' },
  ];

  return (
    <aside
      className={`
        relative flex flex-col
        bg-surface-1/20 backdrop-blur-glass
        border-r border-border/10 shadow-glass
        transition-all duration-300 ease-premium
        ${isExpanded ? 'w-72' : 'w-20'}
        overflow-hidden
      `}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative px-6 py-6 border-b border-border/10 flex items-center justify-between group hover:bg-surface-1/30 transition-colors duration-200">
        {isExpanded && (
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center font-display text-base font-bold text-white shadow-lg">
              Z
            </div>
            <span className="font-display text-lg font-semibold text-text-primary">ZenPC</span>
          </Link>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto p-2 hover:bg-surface-2/50 rounded-lg transition-colors duration-200 text-text-muted hover:text-text-primary"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '◀' : '▶'}
        </button>
      </div>

      {/* New Build Button */}
      <div className="relative px-4 py-4 border-b border-border/10">
        <button
          onClick={onNewBuild}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-gradient-to-r from-accent/80 to-accent/60
            hover:from-accent to-accent/70
            text-white font-medium text-sm
            shadow-lg hover:shadow-xl
            transition-all duration-300 ease-premium
            hover:scale-105 active:scale-95
            flex items-center justify-center gap-2
            relative overflow-hidden group
          `}
        >
          <span className="text-lg">+</span>
          {isExpanded && <span>New Build</span>}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative flex-shrink-0 px-3 py-4 space-y-2 border-b border-border/10">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModeChange(item.id)}
            className={`
              w-full px-3 py-3 rounded-lg transition-all duration-200 ease-premium
              flex items-center gap-3
              ${
                activeMode === item.id
                  ? 'bg-accent/15 border border-accent/30 text-text-primary shadow-md'
                  : 'hover:bg-surface-1/50 border border-transparent text-text-muted hover:text-text-primary'
              }
            `}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Build History Section */}
      <div className="relative flex-1 overflow-hidden flex flex-col border-b border-border/10">
        <div className="px-3 py-3">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            {isExpanded ? 'Recent Builds' : '📁'}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-3/30">
          {builds.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-text-muted">{isExpanded ? 'No saved builds' : '—'}</p>
            </div>
          ) : (
            builds.slice(0, 8).map((build) => (
              <div
                key={build.id}
                className="group relative"
                onClick={() => onLoadBuild(build)}
              >
                <button
                  className={`
                    w-full px-3 py-2.5 rounded-lg text-left
                    transition-all duration-200 ease-premium
                    text-sm font-medium
                    hover:bg-surface-1/50 border border-transparent hover:border-border/20
                    ${isExpanded ? '' : 'text-center'}
                  `}
                  title={isExpanded ? '' : build.name}
                >
                  {isExpanded ? (
                    <>
                      <div className="truncate text-text-primary">{build.name}</div>
                      <div className="text-xs text-text-muted mt-0.5">
                        {new Date(build.updatedAt).toLocaleDateString()}
                      </div>
                    </>
                  ) : (
                    <span className="text-xs">📄</span>
                  )}
                </button>

                {/* Quick actions on hover */}
                {isExpanded && (
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateBuild(build);
                      }}
                      className="p-1 hover:bg-surface-2/50 rounded text-xs transition-colors duration-200"
                      title="Duplicate"
                    >
                      📋
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBuild(build.id);
                      }}
                      className="p-1 hover:bg-red-500/20 rounded text-xs transition-colors duration-200"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Section */}
      <div className="relative px-3 py-4 border-t border-border/10 mt-auto">
        {user ? (
          <>
            {isExpanded && (
              <>
                <div className="mb-3 p-3 rounded-lg bg-surface-1/30 border border-border/10 transition-all duration-200 hover:bg-surface-1/50">
                  <p className="text-xs text-text-muted">Logged in as</p>
                  <p className="text-sm font-medium text-text-primary truncate mt-1">
                    {user.email}
                  </p>
                </div>
              </>
            )}
            <button
              onClick={handleSignOut}
              className="w-full px-3 py-2.5 rounded-lg text-sm font-medium
                text-text-primary hover:text-text-primary hover:bg-red-500/15
                border border-border/20 hover:border-red-500/30
                transition-all duration-200 ease-premium active:scale-95"
            >
              {isExpanded ? 'Sign Out' : '🚪'}
            </button>
          </>
        ) : (
          <div className="space-y-2">
            <Link href="/login">
              <button className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary
                hover:bg-surface-1/50 border border-border/20 transition-all duration-200 ease-premium active:scale-95">
                {isExpanded ? 'Sign In' : '🔑'}
              </button>
            </Link>
            <Link href="/register">
              <button className="w-full px-3 py-2.5 rounded-lg text-sm font-medium
                bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30
                transition-all duration-200 ease-premium active:scale-95">
                {isExpanded ? 'Sign Up' : '✨'}
              </button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
