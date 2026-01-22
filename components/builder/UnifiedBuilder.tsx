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
          <div className="space-y-6">
            {builds.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-accent/20 bg-gradient-to-br from-surface-2/30 via-surface-1/20 to-surface-2/10 backdrop-blur-xl p-16"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-accent-secondary/20 border border-accent/30 flex items-center justify-center mb-6 text-3xl"
                  >
                    📁
                  </motion.div>
                  <h3 className="font-display text-xl font-semibold text-text-primary mb-2">No Saved Builds Yet</h3>
                  <p className="text-text-muted max-w-sm mx-auto">Start building your dream PC and save it to access it anytime. Your creations will appear here.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
              >
                {builds.map((build, idx) => (
                  <motion.div
                    key={build.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ y: -4 }}
                    onClick={() => handleLoadBuild(build)}
                    className="group cursor-pointer h-full"
                  >
                    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-surface-2/50 via-surface-1/40 to-surface-2/30 backdrop-blur-xl p-6 h-full overflow-hidden hover:border-accent/40 transition-all duration-300">
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Content */}
                      <div className="relative flex flex-col h-full gap-4">
                        <div>
                          <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors duration-300 line-clamp-2 text-lg">
                            {build.name}
                          </h3>
                          <p className="text-xs text-text-muted mt-2 font-light">
                            Updated {new Date(build.updatedAt).toLocaleDateString()} • {new Date(build.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* Parts Preview */}
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(build.parts).slice(0, 3).map(part => (
                            <span key={part} className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 font-medium">
                              {part.charAt(0).toUpperCase() + part.slice(1)}
                            </span>
                          ))}
                          {Object.keys(build.parts).length > 3 && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-surface-3/50 text-text-muted border border-white/10 font-medium">
                              +{Object.keys(build.parts).length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto pt-4 border-t border-white/5 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateBuild(build);
                            }}
                            className="p-2.5 hover:bg-accent/20 rounded-lg transition-all duration-300 text-text-muted hover:text-accent border border-transparent hover:border-accent/30"
                            title="Duplicate build"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBuild(build.id);
                            }}
                            className="p-2.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-text-muted hover:text-red-400 border border-transparent hover:border-red-500/30"
                            title="Delete build"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
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
        {/* Premium Top Action Bar with Glassmorphism */}
        <motion.div 
          className="border-b border-white/5 bg-gradient-to-b from-surface-1/80 via-surface-1/40 to-transparent backdrop-blur-2xl px-8 py-6 sticky top-0 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
            {/* Left: Title with Icon */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-accent-secondary/20 border border-accent/30 flex items-center justify-center text-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {activeMode === 'build' && '⚙️'}
                  {activeMode === 'guide' && '📖'}
                  {activeMode === 'insights' && '📊'}
                  {activeMode === 'profile' && '👤'}
                  {activeMode === 'history' && '📁'}
                </motion.div>
                <div>
                  <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-text-primary via-accent to-accent-secondary bg-clip-text text-transparent">
                    {activeMode === 'build' && 'Build Configuration'}
                    {activeMode === 'guide' && 'Build Guide'}
                    {activeMode === 'insights' && 'Build Insights'}
                    {activeMode === 'profile' && 'Account & Profile'}
                    {activeMode === 'history' && 'Saved Builds'}
                  </h1>
                  <p className="text-sm text-text-muted mt-0.5 font-light">
                    {activeMode === 'build' && 'Select and configure premium PC components'}
                    {activeMode === 'guide' && 'Expert recommendations and best practices'}
                    {activeMode === 'insights' && 'Performance metrics and detailed analysis'}
                    {activeMode === 'profile' && 'Manage your account and preferences'}
                    {activeMode === 'history' && 'Access and manage all your creations'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: Status Indicators */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2/40 border border-accent/10">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-xs font-medium text-text-muted">Ready to Build</span>
              </div>
            </motion.div>
          </div>

          {/* Gradient divider */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
        </motion.div>

        {/* Panel Content with Animated Transitions */}
        <div className="flex-1 overflow-auto bg-gradient-to-b from-bg via-surface-1/20 to-bg">
          <motion.div 
            className="p-8 max-w-7xl mx-auto w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {renderActivePanel()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
