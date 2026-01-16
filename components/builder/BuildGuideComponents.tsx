'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Card } from '@/components/ui/Card';

// Enhanced Step Card Component
export const EnhancedStepCard = ({ 
  step, 
  isExpanded, 
  isCurrent, 
  onToggle, 
  onQuickAction 
}: {
  step: any;
  isExpanded: boolean;
  isCurrent: boolean;
  onToggle: () => void;
  onQuickAction: (action: string) => void;
}) => {
  const STATUS_CONFIG = {
    blocked: { color: 'red', label: 'Blocked', icon: '🚫' },
    ready: { color: 'gray', label: 'Ready', icon: '⏸️' },
    in_progress: { color: 'blue', label: 'In Progress', icon: '🔄' },
    completed: { color: 'green', label: 'Completed', icon: '✅' },
    warning: { color: 'yellow', label: 'Warning', icon: '⚠️' }
  };

  const statusConfig = STATUS_CONFIG[step.status as keyof typeof STATUS_CONFIG];

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      isCurrent ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''
    }`}>
      <div className="p-6">
        {/* Step Header */}
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center gap-4">
            {/* Step number/status indicator */}
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                isCurrent 
                  ? 'bg-accent text-white shadow-lg' 
                  : `bg-${statusConfig.color}/10 text-${statusConfig.color}`
              }`}>
                {step.status === 'completed' ? '✓' : step.stepNumber || '?'}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-text-primary truncate">{step.title}</h3>
                <Badge variant={statusConfig.color as any} className="flex-shrink-0">
                  {statusConfig.label}
                </Badge>
                {isCurrent && (
                  <Badge variant="accent" className="flex-shrink-0">CURRENT</Badge>
                )}
              </div>
              <p className="text-sm text-text-muted line-clamp-2">{step.description}</p>
              
              {/* Progress bar */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-text-muted mb-1">
                  <span>Progress</span>
                  <span>{step.progress}%</span>
                </div>
                <Progress value={step.progress} className="h-1" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Issue indicators */}
            <div className="flex items-center gap-1">
              {step.errors?.length > 0 && (
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title={`${step.errors.length} errors`}></div>
              )}
              {step.warnings?.length > 0 && (
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" title={`${step.warnings.length} warnings`}></div>
              )}
              {step.recommendations?.length > 0 && (
                <div className="w-2 h-2 rounded-full bg-blue-500" title={`${step.recommendations.length} recommendations`}></div>
              )}
            </div>
            
            {/* Expand/collapse icon */}
            <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button 
            onClick={() => onQuickAction('focus')}
            className="px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            🎯 Focus
          </button>
          <button 
            onClick={() => onQuickAction('copy')}
            className="px-3 py-1.5 bg-surface-1/30 text-text-primary rounded-lg text-sm font-medium hover:bg-surface-1/50 transition-colors"
          >
            📋 Copy
          </button>
          <button 
            onClick={() => onQuickAction('save')}
            className="px-3 py-1.5 bg-surface-1/30 text-text-primary rounded-lg text-sm font-medium hover:bg-surface-1/50 transition-colors"
          >
            💾 Save
          </button>
        </div>
      </div>
    </Card>
  );
};

// Smart Recommendation Card
export const SmartRecommendationCard = ({ 
  recommendation, 
  onApply, 
  onDismiss, 
  onLearnMore 
}: {
  recommendation: any;
  onApply: () => void;
  onDismiss: () => void;
  onLearnMore: () => void;
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="p-4 rounded-lg bg-surface-1/30 border border-border/10 hover:border-accent/20 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 bg-${
          recommendation.priority === 'high' ? 'red' : 
          recommendation.priority === 'medium' ? 'yellow' : 'green'
        }-500`}></div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-text-primary">{recommendation.title}</div>
            <Badge variant={getPriorityColor(recommendation.priority) as any} className="text-xs">
              {recommendation.priority}
            </Badge>
          </div>
          <div className="text-sm text-text-muted mb-2">{recommendation.description}</div>
          {recommendation.reasoning && (
            <div className="text-xs text-text-muted bg-surface-1/50 p-2 rounded border-l-2 border-accent/30 mb-3">
              <strong>Why this matters:</strong> {recommendation.reasoning}
            </div>
          )}
          
          {/* Quick action buttons */}
          <div className="flex gap-2">
            <button 
              onClick={onApply}
              className="px-3 py-1 bg-accent text-white rounded text-xs font-medium hover:bg-accent/90 transition-colors"
            >
              Apply Fix
            </button>
            <button 
              onClick={onLearnMore}
              className="px-3 py-1 bg-surface-1/50 text-text-primary rounded text-xs font-medium hover:bg-surface-1/70 transition-colors"
            >
              Learn More
            </button>
            <button 
              onClick={onDismiss}
              className="px-3 py-1 bg-surface-1/50 text-text-primary rounded text-xs font-medium hover:bg-surface-1/70 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Achievement Badge Component
export const AchievementBadge = ({ 
  achievement, 
  isUnlocked 
}: {
  achievement: any;
  isUnlocked: boolean;
}) => {
  return (
    <div
      className={`text-center p-3 rounded-lg border transition-all hover:scale-105 ${
        isUnlocked
          ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 shadow-lg'
          : 'bg-surface-1/30 border-border/20 opacity-60'
      }`}
    >
      <div className="text-2xl mb-1">{achievement.icon}</div>
      <div className="font-medium text-xs text-text-primary">{achievement.title}</div>
      <div className="text-xs text-text-muted">{achievement.description}</div>
      {isUnlocked && (
        <div className="text-xs text-green-500 mt-1">✓ Unlocked</div>
      )}
    </div>
  );
};

// Build Score Component
export const BuildScoreDisplay = ({ 
  buildScore 
}: {
  buildScore: {
    total: number;
    compatibility: number;
    performance: number;
    value: number;
    upgradeability: number;
  };
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="text-center p-3 rounded-lg bg-surface-1/30">
        <div className={`text-lg font-bold ${getScoreColor(buildScore.compatibility)}`}>
          {buildScore.compatibility}%
        </div>
        <div className="text-xs text-text-muted">Compatibility</div>
      </div>
      <div className="text-center p-3 rounded-lg bg-surface-1/30">
        <div className={`text-lg font-bold ${getScoreColor(buildScore.performance)}`}>
          {buildScore.performance}%
        </div>
        <div className="text-xs text-text-muted">Performance</div>
      </div>
      <div className="text-center p-3 rounded-lg bg-surface-1/30">
        <div className={`text-lg font-bold ${getScoreColor(buildScore.value)}`}>
          {buildScore.value}%
        </div>
        <div className="text-xs text-text-muted">Value Score</div>
      </div>
      <div className="text-center p-3 rounded-lg bg-surface-1/30">
        <div className={`text-lg font-bold ${getScoreColor(buildScore.upgradeability)}`}>
          {buildScore.upgradeability}%
        </div>
        <div className="text-xs text-text-muted">Upgrade Path</div>
      </div>
    </div>
  );
};

// Quick Action Button Component
export const QuickActionButton = ({ 
  action, 
  onClick 
}: {
  action: {
    id: string;
    label: string;
    icon: string;
    shortcut?: string;
    disabled?: boolean;
  };
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
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
  );
};

// Phase Navigation Component
export const PhaseNavigation = ({ 
  phases, 
  currentPhase, 
  selectedPhase, 
  onPhaseSelect 
}: {
  phases: any;
  currentPhase: string;
  selectedPhase: string | null;
  onPhaseSelect: (phase: string) => void;
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {Object.entries(phases).map(([phase, config]: [string, any]) => {
        const isActive = currentPhase === phase;
        const isSelected = selectedPhase === phase;
        const hasIssues = false; // Would be calculated from actual data
        
        return (
          <button
            key={phase}
            onClick={() => onPhaseSelect(phase)}
            className={`relative p-3 rounded-lg border transition-all hover:scale-105 ${
              isSelected 
                ? 'border-accent bg-accent/10 text-accent shadow-lg' 
                : isActive
                ? 'border-accent/50 bg-accent/5 text-accent'
                : 'border-border/20 bg-surface-1/60 text-text-primary hover:border-accent/20'
            }`}
          >
            {hasIssues && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            )}
            
            <div className="text-center">
              <div className="text-2xl mb-1">{config.icon}</div>
              <div className="font-medium text-xs mb-1">{config.title}</div>
              <div className="text-xs text-text-muted">0%</div>
              <div className="h-1 mt-2 bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full bg-accent transition-all duration-300" style={{ width: '0%' }}></div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
