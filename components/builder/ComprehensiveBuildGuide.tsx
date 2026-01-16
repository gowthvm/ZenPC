'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useBuilderStore } from '@/store/builder';
import { BuildGuideEngine, BuildGuideState, BuildPhase, UseCaseAnalysis } from '@/lib/buildGuideEngine';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

interface ComprehensiveBuildGuideProps {
  className?: string;
  mode?: 'quick_start' | 'expert' | 'guided';
  showOnboarding?: boolean;
}

type ViewMode = 'overview' | 'detailed' | 'timeline' | 'summary';
type UserLevel = 'beginner' | 'intermediate' | 'expert';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
}

interface BuildScore {
  total: number;
  compatibility: number;
  performance: number;
  value: number;
  upgradeability: number;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  shortcut?: string;
  disabled?: boolean;
}

const PHASE_CONFIG = {
  pre_build_planning: {
    title: 'Pre-Build Planning',
    description: 'Define your requirements and make strategic decisions',
    icon: '📋',
    color: 'blue'
  },
  component_selection: {
    title: 'Component Selection',
    description: 'Choose compatible components that meet your needs',
    icon: '🔧',
    color: 'green'
  },
  system_constraints: {
    title: 'System Constraints',
    description: 'Verify power, thermal, and physical compatibility',
    icon: '⚡',
    color: 'yellow'
  },
  build_order: {
    title: 'Build Order & Assembly',
    description: 'Step-by-step physical assembly instructions',
    icon: '🔨',
    color: 'purple'
  },
  firmware_setup: {
    title: 'Firmware & Software Setup',
    description: 'Configure BIOS, install OS and drivers',
    icon: '💻',
    color: 'indigo'
  },
  validation_review: {
    title: 'Validation & Review',
    description: 'Final testing and build completion',
    icon: '✅',
    color: 'emerald'
  }
} as const;

const STATUS_CONFIG = {
  blocked: { color: 'red', label: 'Blocked', icon: '🚫' },
  ready: { color: 'gray', label: 'Ready', icon: '⏸️' },
  in_progress: { color: 'blue', label: 'In Progress', icon: '🔄' },
  completed: { color: 'green', label: 'Completed', icon: '✅' },
  warning: { color: 'yellow', label: 'Warning', icon: '⚠️' }
} as const;

export const ComprehensiveBuildGuide: React.FC<ComprehensiveBuildGuideProps> = ({ 
  className = '',
  mode = 'guided',
  showOnboarding = false 
}) => {
  const { selected } = useBuilderStore();
  const [guideState, setGuideState] = useState<BuildGuideState | null>(null);
  const [engine] = useState(() => new BuildGuideEngine(selected));
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [showUseCaseModal, setShowUseCaseModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [userLevel, setUserLevel] = useState<UserLevel>('intermediate');
  const [showHelp, setShowHelp] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [buildScore, setBuildScore] = useState<BuildScore | null>(null);
  const [showTutorial, setShowTutorial] = useState(showOnboarding);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<BuildPhase | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);
  const stepRefs = useRef<Record<string, HTMLDivElement>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Enhanced update guide with loading states
  useEffect(() => {
    const updateGuide = async () => {
      setIsLoading(true);
      try {
        const state = await engine.updateParts(selected);
        setGuideState(state);
        calculateBuildScore(state);
        checkAchievements(state);
        setAutoSaveStatus('saved');
      } catch (error) {
        console.error('Error updating build guide:', error);
        setAutoSaveStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    updateGuide();
  }, [selected, engine]);

  // Auto-expand current step with smooth scroll
  useEffect(() => {
    if (guideState?.currentStep) {
      setExpandedSteps(prev => new Set([...prev, guideState.currentStep]));
      // Smooth scroll to current step
      setTimeout(() => {
        stepRefs.current[guideState.currentStep]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [guideState?.currentStep]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!keyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            navigateToNextStep();
            break;
          case 'p':
            e.preventDefault();
            navigateToPreviousStep();
            break;
          case 's':
            e.preventDefault();
            saveProgress();
            break;
          case 'h':
            e.preventDefault();
            setShowHelp(!showHelp);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcuts, showHelp]);

  // Touch gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateToNextStep();
      } else {
        navigateToPreviousStep();
      }
    }
    setTouchStart(null);
  };

  // Enhanced functions
  const toggleStepExpansion = useCallback((stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  }, []);

  const getStatusColor = (status: keyof typeof STATUS_CONFIG) => STATUS_CONFIG[status].color;

  const calculateBuildScore = useCallback((state: BuildGuideState) => {
    const score: BuildScore = {
      total: Math.round(state.overallProgress),
      compatibility: state.buildHealth === 'excellent' ? 100 : 
                    state.buildHealth === 'good' ? 80 :
                    state.buildHealth === 'fair' ? 60 :
                    state.buildHealth === 'poor' ? 40 : 20,
      performance: Math.min(100, state.summary.totalIssues === 0 ? 100 : 100 - (state.summary.criticalIssues * 20)),
      value: Math.round(Math.random() * 30 + 70), // Placeholder for value calculation
      upgradeability: state.summary.upgradePotential === 'high' ? 100 :
                      state.summary.upgradePotential === 'medium' ? 60 : 30
    };
    setBuildScore(score);
  }, []);

  const checkAchievements = useCallback((state: BuildGuideState) => {
    const newAchievements: Achievement[] = [];
    
    // Check for various achievements
    if (state.overallProgress === 100) {
      newAchievements.push({
        id: 'build_complete',
        title: 'Build Master',
        description: 'Completed your first PC build guide',
        icon: '🏆',
        progress: 100,
        unlockedAt: new Date()
      });
    }
    
    if (state.summary.criticalIssues === 0 && state.summary.warnings === 0) {
      newAchievements.push({
        id: 'perfect_build',
        title: 'Perfect Build',
        description: 'No issues or warnings detected',
        icon: '💎',
        progress: 100,
        unlockedAt: new Date()
      });
    }
    
    setAchievements(prev => [...prev, ...newAchievements]);
  }, []);

  const navigateToNextStep = useCallback(() => {
    if (!guideState) return;
    
    const currentIndex = guideState.steps.findIndex(s => s.id === guideState.currentStep);
    if (currentIndex < guideState.steps.length - 1) {
      const nextStep = guideState.steps[currentIndex + 1];
      setExpandedSteps(prev => new Set([...prev, nextStep.id]));
      stepRefs.current[nextStep.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [guideState]);

  const navigateToPreviousStep = useCallback(() => {
    if (!guideState) return;
    
    const currentIndex = guideState.steps.findIndex(s => s.id === guideState.currentStep);
    if (currentIndex > 0) {
      const prevStep = guideState.steps[currentIndex - 1];
      setExpandedSteps(prev => new Set([...prev, prevStep.id]));
      stepRefs.current[prevStep.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [guideState]);

  const saveProgress = useCallback(() => {
    setAutoSaveStatus('saving');
    // Simulate save operation
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 1000);
  }, []);

  const getQuickActions = useCallback((): QuickAction[] => [
    {
      id: 'next_step',
      label: 'Next Step',
      icon: '→',
      action: navigateToNextStep,
      shortcut: 'Ctrl+N',
      disabled: !guideState || guideState.overallProgress === 100
    },
    {
      id: 'prev_step',
      label: 'Previous Step',
      icon: '←',
      action: navigateToPreviousStep,
      shortcut: 'Ctrl+P',
      disabled: !guideState || guideState.steps.findIndex(s => s.id === guideState.currentStep) === 0
    },
    {
      id: 'save',
      label: 'Save Progress',
      icon: '💾',
      action: saveProgress,
      shortcut: 'Ctrl+S'
    },
    {
      id: 'help',
      label: 'Show Help',
      icon: '?',
      action: () => setShowHelp(!showHelp),
      shortcut: 'Ctrl+H'
    }
  ], [guideState, navigateToNextStep, navigateToPreviousStep, saveProgress, showHelp]);

  const filteredSteps = useMemo(() => {
    if (!guideState) return [];
    
    let steps = guideState.steps;
    
    // Filter by search query
    if (searchQuery) {
      steps = steps.filter(step => 
        step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        step.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by selected phase
    if (selectedPhase) {
      steps = steps.filter(step => step.phase === selectedPhase);
    }
    
    // Filter by mode
    if (mode === 'quick_start') {
      steps = steps.filter(step => step.status === 'in_progress' || step.status === 'ready');
    }
    
    return steps;
  }, [guideState, searchQuery, selectedPhase, mode]);

  if (!guideState) {
    return (
      <div className={`card p-8 ${className}`}>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-muted">Loading build guide...</p>
        </div>
      </div>
    );
  }

  // Tutorial Overlay
  if (showTutorial) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Welcome to Your PC Build Guide! 🚀</h2>
            <div className="space-y-4 text-text-primary">
              <p>This interactive guide will walk you through every step of building your perfect PC.</p>
              
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">1</div>
                  <div>
                    <h3 className="font-semibold">Progressive Disclosure</h3>
                    <p className="text-sm text-text-muted">We show you only what you need, when you need it</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">2</div>
                  <div>
                    <h3 className="font-semibold">Smart Recommendations</h3>
                    <p className="text-sm text-text-muted">Get personalized suggestions based on your needs</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">3</div>
                  <div>
                    <h3 className="font-semibold">Real-time Progress</h3>
                    <p className="text-sm text-text-muted">Track your build completion and earn achievements</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">4</div>
                  <div>
                    <h3 className="font-semibold">Keyboard Shortcuts</h3>
                    <p className="text-sm text-text-muted">Use Ctrl+N (next), Ctrl+P (previous), Ctrl+S (save)</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  Start Building! 🎯
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`space-y-6 ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Enhanced Header with Build Health and Score */}
      <div className="card p-6 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
        
        <div className="relative">
          {/* Top bar with controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-1">PC Build Guide</h1>
                <p className="text-text-muted">Your intelligent building companion</p>
              </div>
              
              {/* Mode selector */}
              <div className="hidden md:flex items-center gap-2 bg-surface-1/50 rounded-lg p-1">
                {(['guided', 'quick_start', 'expert'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m === 'quick_start' ? 'overview' : 'detailed')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      mode === m 
                        ? 'bg-accent text-white' 
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {m === 'guided' ? '🎯 Guided' : m === 'quick_start' ? '⚡ Quick Start' : '🔧 Expert'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Auto-save indicator */}
              <div className="flex items-center gap-2 text-sm">
                {autoSaveStatus === 'saved' && <span className="text-green-500">✓</span>}
                {autoSaveStatus === 'saving' && <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>}
                {autoSaveStatus === 'error' && <span className="text-red-500">✗</span>}
                <span className="text-text-muted hidden sm:inline">
                  {autoSaveStatus === 'saved' ? 'Saved' : autoSaveStatus === 'saving' ? 'Saving...' : 'Error'}
                </span>
              </div>
              
              {/* Help button */}
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="w-8 h-8 rounded-lg bg-surface-1/50 flex items-center justify-center hover:bg-surface-1 transition-colors"
              >
                ?
              </button>
            </div>
          </div>

          {/* Enhanced Progress Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Main progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-text-primary">Overall Progress</span>
                <span className="text-2xl font-bold text-accent">{guideState.overallProgress}%</span>
              </div>
              <Progress value={guideState.overallProgress} className="h-3 mb-3" />
              
              {/* Build health badge */}
              <div className="flex items-center gap-2">
                <Badge variant={
                  guideState.buildHealth === 'excellent' ? 'success' : 
                  guideState.buildHealth === 'good' ? 'default' :
                  guideState.buildHealth === 'fair' ? 'warning' :
                  guideState.buildHealth === 'poor' ? 'danger' : 'critical'
                }>
                  {guideState.buildHealth.toUpperCase()} BUILD HEALTH
                </Badge>
                {buildScore && (
                  <span className="text-sm text-text-muted">
                    Score: {buildScore.total}/100
                  </span>
                )}
              </div>
            </div>
            
            {/* Build Score breakdown */}
            {buildScore && (
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-surface-1/30">
                  <div className="text-lg font-bold text-green-500">{buildScore.compatibility}%</div>
                  <div className="text-xs text-text-muted">Compatibility</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-surface-1/30">
                  <div className="text-lg font-bold text-blue-500">{buildScore.performance}%</div>
                  <div className="text-xs text-text-muted">Performance</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-surface-1/30">
                  <div className="text-lg font-bold text-purple-500">{buildScore.value}%</div>
                  <div className="text-xs text-text-muted">Value Score</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-surface-1/30">
                  <div className="text-lg font-bold text-orange-500">{buildScore.upgradeability}%</div>
                  <div className="text-xs text-text-muted">Upgrade Path</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap gap-2">
            {getQuickActions().map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                disabled={action.disabled}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  action.disabled
                    ? 'bg-surface-1/20 text-text-muted cursor-not-allowed'
                    : 'bg-accent/10 text-accent hover:bg-accent/20'
                }`}
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
                {action.shortcut && (
                  <span className="text-xs text-text-muted ml-1">{action.shortcut}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search steps, recommendations, or issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-1/50 border border-border/20 rounded-lg focus:outline-none focus:border-accent/50 text-text-primary placeholder-text-muted"
              />
              <span className="absolute left-3 top-2.5 text-text-muted">🔍</span>
            </div>
          </div>
          
          {/* View mode selector */}
          <div className="flex items-center gap-2">
            {(['overview', 'detailed', 'timeline', 'summary'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-accent text-white'
                    : 'bg-surface-1/50 text-text-muted hover:text-text-primary'
                }`}
              >
                {mode === 'overview' ? '📊 Overview' : 
                 mode === 'detailed' ? '📝 Detailed' :
                 mode === 'timeline' ? '📅 Timeline' : '📋 Summary'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(PHASE_CONFIG).map(([phase, config]) => {
            const isActive = guideState.currentPhase === phase;
            const phaseSteps = guideState.steps.filter(s => s.phase === phase);
            const completedSteps = phaseSteps.filter(s => s.status === 'completed').length;
            const phaseProgress = phaseSteps.length > 0 ? (completedSteps / phaseSteps.length) * 100 : 0;
            
            return (
              <button
                key={phase}
                onClick={() => {
                  // Navigate to first incomplete step in this phase
                  const firstIncomplete = phaseSteps.find(s => s.status !== 'completed');
                  if (firstIncomplete) {
                    setExpandedSteps(prev => new Set([...prev, firstIncomplete.id]));
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  isActive 
                    ? 'border-accent bg-accent/10 text-accent' 
                    : 'border-border/20 bg-surface-1/60 text-text-primary hover:border-accent/20'
                }`}
              >
                <span className="text-lg">{config.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-sm">{config.title}</div>
                  <div className="text-xs text-text-muted">{Math.round(phaseProgress)}%</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {guideState.steps.map((step) => {
          const isExpanded = expandedSteps.has(step.id);
          const isCurrent = step.id === guideState.currentStep;
          const statusConfig = STATUS_CONFIG[step.status];
          const phaseConfig = PHASE_CONFIG[step.phase];
          
          return (
            <Card key={step.id} className={`transition-all ${isCurrent ? 'ring-2 ring-accent' : ''}`}>
              <div className="p-6">
                {/* Step Header */}
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleStepExpansion(step.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-${statusConfig.color}/10`}>
                      {statusConfig.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-text-primary">{step.title}</h3>
                        <Badge variant={getStatusColor(step.status)}>
                          {statusConfig.label}
                        </Badge>
                        {isCurrent && (
                          <Badge variant="accent">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-text-muted">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-text-primary">{step.progress}%</div>
                      <Progress value={step.progress} className="w-20 h-1" />
                    </div>
                    <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-6 space-y-6 border-t border-border/10 pt-6">
                    {/* Dependencies */}
                    {step.dependencies.length > 0 && (
                      <div>
                        <h4 className="font-medium text-text-primary mb-2">Dependencies</h4>
                        <div className="flex flex-wrap gap-2">
                          {step.dependencies.map(dep => (
                            <Badge key={dep} variant="outline" className="text-xs">
                              {dep.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {step.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-text-primary mb-3">Recommendations</h4>
                        <div className="space-y-2">
                          {step.recommendations.map((rec, index) => (
                            <div key={index} className="p-3 rounded-lg bg-surface-1/50 border border-border/10">
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 bg-${
                                  rec.priority === 'high' ? 'red' : 
                                  rec.priority === 'medium' ? 'yellow' : 'green'
                                }-500`}></div>
                                <div className="flex-1">
                                  <div className="font-medium text-text-primary">{rec.title}</div>
                                  <div className="text-sm text-text-muted">{rec.description}</div>
                                  {rec.reasoning && (
                                    <div className="text-xs text-text-muted mt-1 italic">
                                      Why: {rec.reasoning}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warnings */}
                    {step.warnings.length > 0 && (
                      <div>
                        <h4 className="font-medium text-text-primary mb-3">Warnings</h4>
                        <div className="space-y-2">
                          {step.warnings.map((warning, index) => (
                            <div key={index} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                              <div className="flex items-start gap-3">
                                <span className="text-yellow-500">⚠️</span>
                                <div className="flex-1">
                                  <div className="font-medium text-text-primary">{warning.title}</div>
                                  <div className="text-sm text-text-muted">{warning.description}</div>
                                  {warning.resolution && (
                                    <div className="text-sm text-accent mt-1">
                                      Resolution: {warning.resolution}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Errors */}
                    {step.errors.length > 0 && (
                      <div>
                        <h4 className="font-medium text-text-primary mb-3">Errors</h4>
                        <div className="space-y-2">
                          {step.errors.map((error, index) => (
                            <div key={index} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                              <div className="flex items-start gap-3">
                                <span className="text-red-500">❌</span>
                                <div className="flex-1">
                                  <div className="font-medium text-text-primary">{error.title}</div>
                                  <div className="text-sm text-text-muted">{error.description}</div>
                                  {error.resolution && (
                                    <div className="text-sm text-accent mt-1">
                                      Resolution: {error.resolution}
                                    </div>
                                  )}
                                  {error.blocking && (
                                    <Badge variant="danger" className="mt-2">Blocking</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {step.actions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-text-primary mb-3">Actions</h4>
                        <div className="space-y-2">
                          {step.actions.map((action, index) => (
                            <div key={index} className="p-3 rounded-lg bg-surface-1/50 border border-border/10">
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={action.completed}
                                  onChange={() => {
                                    // Toggle action completion
                                    // This would update the engine state
                                  }}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-text-primary">{action.title}</div>
                                  <div className="text-sm text-text-muted">{action.description}</div>
                                  {action.instructions.length > 0 && (
                                    <div className="mt-2">
                                      <div className="text-xs font-medium text-text-primary mb-1">Instructions:</div>
                                      <ul className="text-xs text-text-muted space-y-1">
                                        {action.instructions.map((instruction, i) => (
                                          <li key={i} className="flex items-start gap-1">
                                            <span>{i + 1}.</span>
                                            <span>{instruction}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
