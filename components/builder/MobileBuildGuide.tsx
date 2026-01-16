'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

// Mobile-optimized step card with touch interactions
export const MobileStepCard = ({ 
  step, 
  isExpanded, 
  isCurrent, 
  onToggle,
  onSwipe 
}: {
  step: any;
  isExpanded: boolean;
  isCurrent: boolean;
  onToggle: () => void;
  onSwipe: (direction: 'left' | 'right') => void;
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipe('left');
    }
    if (isRightSwipe) {
      onSwipe('right');
    }
  };

  return (
    <div
      className="touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Card className={`mb-4 transition-all ${isCurrent ? 'ring-2 ring-accent' : ''}`}>
        <div className="p-4">
          {/* Mobile-optimized header */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              isCurrent ? 'bg-accent text-white' : 'bg-surface-1/50'
            }`}>
              {step.status === 'completed' ? '✓' : step.stepNumber}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary truncate">{step.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {step.status}
                </Badge>
                {isCurrent && (
                  <Badge variant="accent" className="text-xs">Current</Badge>
                )}
              </div>
            </div>
            <button
              onClick={onToggle}
              className="w-8 h-8 rounded-full bg-surface-1/50 flex items-center justify-center"
            >
              <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mb-3">
            <Progress value={step.progress} className="h-2" />
            <div className="text-xs text-text-muted mt-1">{step.progress}% complete</div>
          </div>

          {/* Issue indicators */}
          {(step.errors?.length > 0 || step.warnings?.length > 0) && (
            <div className="flex gap-2 mb-3">
              {step.errors?.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <span>❌</span>
                  <span>{step.errors.length} errors</span>
                </div>
              )}
              {step.warnings?.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-yellow-500">
                  <span>⚠️</span>
                  <span>{step.warnings.length} warnings</span>
                </div>
              )}
            </div>
          )}

          {/* Expanded content for mobile */}
          {isExpanded && (
            <div className="space-y-3 border-t border-border/10 pt-3">
              {step.recommendations?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {step.recommendations.slice(0, 2).map((rec: any, index: number) => (
                      <div key={index} className="p-2 rounded bg-surface-1/30 text-xs">
                        <div className="font-medium">{rec.title}</div>
                        <div className="text-text-muted">{rec.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-accent text-white rounded-lg text-sm font-medium">
                  Start Step
                </button>
                <button className="flex-1 py-2 bg-surface-1/50 text-text-primary rounded-lg text-sm font-medium">
                  Learn More
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Mobile bottom navigation
export const MobileBottomNav = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  onSave 
}: {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface-2 border-t border-border/20 p-4 z-40">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="w-12 h-12 rounded-full bg-surface-1/50 flex items-center justify-center disabled:opacity-50"
        >
          ←
        </button>
        
        <div className="text-center">
          <div className="text-sm font-medium text-text-primary">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="w-32 h-1 mt-1" />
        </div>
        
        <button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center disabled:opacity-50"
        >
          →
        </button>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 py-2 bg-surface-1/50 text-text-primary rounded-lg text-sm font-medium"
        >
          💾 Save
        </button>
        <button className="flex-1 py-2 bg-accent text-white rounded-lg text-sm font-medium">
          🎯 Continue
        </button>
      </div>
    </div>
  );
};

// Mobile phase selector
export const MobilePhaseSelector = ({ 
  phases, 
  currentPhase, 
  onPhaseSelect 
}: {
  phases: any;
  currentPhase: string;
  onPhaseSelect: (phase: string) => void;
}) => {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {Object.entries(phases).map(([phase, config]: [string, any]) => {
          const isActive = currentPhase === phase;
          
          return (
            <button
              key={phase}
              onClick={() => onPhaseSelect(phase)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all whitespace-nowrap ${
                isActive 
                  ? 'border-accent bg-accent/10 text-accent' 
                  : 'border-border/20 bg-surface-1/60 text-text-primary'
              }`}
            >
              <span>{config.icon}</span>
              <span className="text-sm font-medium">{config.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Mobile quick actions
export const MobileQuickActions = ({ 
  onSearch, 
  onFilter, 
  onHelp 
}: {
  onSearch: () => void;
  onFilter: () => void;
  onHelp: () => void;
}) => {
  return (
    <div className="flex gap-2 p-4 bg-surface-1/30">
      <button
        onClick={onSearch}
        className="flex-1 py-2 bg-surface-1/50 text-text-primary rounded-lg text-sm font-medium flex items-center justify-center gap-2"
      >
        🔍 Search
      </button>
      <button
        onClick={onFilter}
        className="flex-1 py-2 bg-surface-1/50 text-text-primary rounded-lg text-sm font-medium flex items-center justify-center gap-2"
      >
        🎯 Filter
      </button>
      <button
        onClick={onHelp}
        className="flex-1 py-2 bg-surface-1/50 text-text-primary rounded-lg text-sm font-medium flex items-center justify-center gap-2"
      >
        ❓ Help
      </button>
    </div>
  );
};
