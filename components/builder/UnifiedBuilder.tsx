'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/store/builder';
import { supabase } from '@/lib/supabaseClient';
import BuilderSidebar from './BuilderSidebar';
import BuildFlowPanel from './BuildFlowPanel';
import GuidePanel from './GuidePanel';
import InsightsPanel from './InsightsPanel';
import ProfilePanel from './ProfilePanel';
import { CursorGlow } from '@/components/effects/MagneticElement';

export type BuilderMode = 'build' | 'guide' | 'insights' | 'profile' | 'history';

interface SavedBuild {
  id: string;
  name: string;
  parts: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export default function UnifiedBuilder() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as BuilderMode) || 'build';
  const [activeMode, setActiveMode] = useState<BuilderMode>(initialTab);
  const [builds, setBuilds] = useState<SavedBuild[]>([]);
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const rafRef = useRef<number>();
  const builderStore = useBuilderStore();

  // Check authentication and load user
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  // Load user's saved builds
  useEffect(() => {
    const loadBuilds = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('builds')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setBuilds(data || []);
      } catch (error) {
        console.error('Error loading builds:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBuilds();
  }, [user]);

  // Smooth cursor effect with requestAnimationFrame - matches landing page
  useEffect(() => {
    setIsClient(true);

    let targetX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let targetY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isClient) return;
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      setSmoothPosition(prev => ({
        x: prev.x + (targetX - prev.x) * 0.1,
        y: prev.y + (targetY - prev.y) * 0.1
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isClient]);

  const handleNewBuild = () => {
    builderStore.reset();
    setCurrentBuildId(null);
    setActiveMode('build');
  };

  const handleLoadBuild = (build: SavedBuild) => {
    // Restore build state
    Object.entries(build.parts).forEach(([category, part]) => {
      builderStore.setPart(category, part);
    });
    setCurrentBuildId(build.id);
    setActiveMode('build');
  };

  const handleSaveBuild = async (buildName: string) => {
    if (!user) return;

    try {
      const buildData = {
        name: buildName,
        parts: builderStore.selected,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (currentBuildId) {
        // Update existing build
        const { error } = await supabase
          .from('builds')
          .update(buildData)
          .eq('id', currentBuildId);
        if (error) throw error;
      } else {
        // Create new build
        const { data, error } = await supabase
          .from('builds')
          .insert([{
            ...buildData,
            created_at: new Date().toISOString(),
          }])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          setCurrentBuildId(data[0].id);
        }
      }

      // Reload builds
      const { data } = await supabase
        .from('builds')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      setBuilds(data || []);
    } catch (error) {
      console.error('Error saving build:', error);
    }
  };

  const handleDeleteBuild = async (buildId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('builds')
        .delete()
        .eq('id', buildId);

      if (error) throw error;

      setBuilds(builds.filter(b => b.id !== buildId));
      if (currentBuildId === buildId) {
        handleNewBuild();
      }
    } catch (error) {
      console.error('Error deleting build:', error);
    }
  };

  const handleDuplicateBuild = async (build: SavedBuild) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('builds')
        .insert([{
          name: `${build.name} (Copy)`,
          parts: build.parts,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select();

      if (error) throw error;

      // Reload builds
      const { data: updatedBuilds } = await supabase
        .from('builds')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      setBuilds(updatedBuilds || []);
    } catch (error) {
      console.error('Error duplicating build:', error);
    }
  };

  const renderActivePanel = () => {
    switch (activeMode) {
      case 'build':
        return (
          <BuildFlowPanel
            onSave={handleSaveBuild}
            buildName={currentBuildId ? builds.find(b => b.id === currentBuildId)?.name : undefined}
          />
        );
      case 'guide':
        return <GuidePanel selectedParts={builderStore.selected} />;
      case 'insights':
        return <InsightsPanel selectedParts={builderStore.selected} />;
      case 'profile':
        return <ProfilePanel user={user} />;
      case 'history':
        return (
          <div className="space-y-4">
            {builds.length === 0 ? (
              <div className="panel text-center py-12">
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="empty-state-title">No Saved Builds</h3>
                  <p className="empty-state-text">All your builds will appear here for easy access</p>
                </div>
              </div>
            ) : (
              <div className="content-grid-2">
                {builds.map(build => (
                  <div
                    key={build.id}
                    className="panel group hover:scale-[1.03] cursor-pointer transition-all duration-base ease-premium"
                    onClick={() => handleLoadBuild(build)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors duration-base line-clamp-2">
                          {build.name}
                        </h3>
                        <p className="text-xs text-text-muted mt-1">
                          Updated {new Date(build.updatedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-border/10 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-base">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateBuild(build);
                          }}
                          className="p-2 hover:bg-accent/10 rounded-lg transition-colors duration-base text-text-muted hover:text-accent"
                          title="Duplicate build"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBuild(build.id);
                          }}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors duration-base text-text-muted hover:text-red-400"
                          title="Delete build"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-dvh bg-bg text-text-primary overflow-hidden relative">
      {/* Ambient cursor glow effect (subtle) */}
      <CursorGlow color="rgb(100, 108, 225)" size={400} blur={80} opacity={0.1} />

      {/* Sidebar */}
      <BuilderSidebar
        user={user}
        builds={builds}
        onNewBuild={handleNewBuild}
        onLoadBuild={handleLoadBuild}
        onDeleteBuild={handleDeleteBuild}
        onDuplicateBuild={handleDuplicateBuild}
        activeMode={activeMode}
        onModeChange={setActiveMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative z-10">
        {/* Top Action Bar */}
        <div className="border-b border-border/8 bg-surface-1/20 backdrop-blur-xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-semibold text-text-primary flex items-center gap-2">
                <span>
                  {activeMode === 'build' && '⚙️'}
                  {activeMode === 'guide' && '📖'}
                  {activeMode === 'insights' && '📊'}
                  {activeMode === 'profile' && '👤'}
                  {activeMode === 'history' && '📁'}
                </span>
                {activeMode === 'build' && 'Build Configuration'}
                {activeMode === 'guide' && 'Build Guide'}
                {activeMode === 'insights' && 'Build Insights'}
                {activeMode === 'profile' && 'Account & Profile'}
                {activeMode === 'history' && 'Saved Builds'}
              </h1>
              <p className="text-xs text-text-muted mt-1">
                {activeMode === 'build' && 'Select and configure PC components'}
                {activeMode === 'guide' && 'Expert recommendations and best practices'}
                {activeMode === 'insights' && 'Performance metrics and analysis'}
                {activeMode === 'profile' && 'Manage your account settings'}
                {activeMode === 'history' && 'Access all your previous builds'}
              </p>
            </div>
          </div>
        </div>

        {/* Panel Content with Animated Transitions */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {renderActivePanel()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
