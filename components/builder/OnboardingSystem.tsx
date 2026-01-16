'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Interactive tutorial component
export const InteractiveTutorial = ({ 
  onComplete, 
  onSkip 
}: {
  onComplete: () => void;
  onSkip: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "Welcome to PC Build Guide! 🚀",
      content: "This intelligent guide will walk you through every step of building your perfect PC.",
      icon: "🎯",
      highlight: "header"
    },
    {
      title: "Progressive Disclosure",
      content: "We show you only what you need, when you need it. No information overload!",
      icon: "📊",
      highlight: "progress"
    },
    {
      title: "Smart Recommendations",
      content: "Get personalized suggestions based on your use case and budget.",
      icon: "💡",
      highlight: "recommendations"
    },
    {
      title: "Real-time Progress Tracking",
      content: "Watch your build come together with visual progress indicators and achievements.",
      icon: "📈",
      highlight: "progress"
    },
    {
      title: "Keyboard Shortcuts",
      content: "Power user? Use Ctrl+N (next), Ctrl+P (previous), Ctrl+S (save) for quick navigation.",
      icon: "⌨️",
      highlight: "shortcuts"
    },
    {
      title: "Mobile Friendly",
      content: "Build on any device! Swipe gestures and touch-optimized controls make mobile building easy.",
      icon: "📱",
      highlight: "mobile"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="p-6">
          {/* Progress indicator */}
          <div className="flex justify-center gap-1 mb-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep ? 'bg-accent w-8' : 'bg-surface-1/50'
                }`}
              />
            ))}
          </div>

          {/* Tutorial content */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">{step.icon}</div>
            <h2 className="text-xl font-bold text-text-primary mb-3">{step.title}</h2>
            <p className="text-text-muted">{step.content}</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 py-2 bg-surface-1/50 text-text-primary rounded-lg font-medium"
              >
                Previous
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="flex-1 py-2 bg-accent text-white rounded-lg font-medium"
            >
              {currentStep === tutorialSteps.length - 1 ? "Start Building!" : "Next"}
            </button>
          </div>

          {/* Skip option */}
          <div className="text-center mt-4">
            <button
              onClick={onSkip}
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contextual help tooltip
export const ContextualHelp = ({ 
  children, 
  content, 
  title 
}: {
  children: React.ReactNode;
  content: string;
  title?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 bg-surface-2 border border-border/20 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          {title && (
            <div className="font-semibold text-text-primary mb-1">{title}</div>
          )}
          <div className="text-sm text-text-muted">{content}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-surface-2 border-r border-b border-border/20 transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Help modal
export const HelpModal = ({ 
  isOpen, 
  onClose 
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Help & Shortcuts</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-surface-1/50 flex items-center justify-center hover:bg-surface-1 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Keyboard Shortcuts */}
            <div>
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                ⌨️ Keyboard Shortcuts
              </h3>
              <div className="grid gap-2">
                {[
                  { key: 'Ctrl + N', action: 'Go to next step' },
                  { key: 'Ctrl + P', action: 'Go to previous step' },
                  { key: 'Ctrl + S', action: 'Save progress' },
                  { key: 'Ctrl + H', action: 'Toggle help' },
                  { key: 'Ctrl + F', action: 'Search steps' },
                  { key: 'Escape', action: 'Close modals' }
                ].map((shortcut) => (
                  <div key={shortcut.key} className="flex justify-between p-2 rounded bg-surface-1/30">
                    <span className="text-sm text-text-muted">{shortcut.action}</span>
                    <kbd className="px-2 py-1 bg-surface-2 rounded text-xs font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Touch Gestures */}
            <div>
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                📱 Touch Gestures (Mobile)
              </h3>
              <div className="space-y-2 text-sm text-text-muted">
                <div className="p-3 rounded bg-surface-1/30 flex items-center gap-3">
                  <span className="text-lg">←</span>
                  <span><strong>Swipe Left:</strong> Go to next step</span>
                </div>
                <div className="p-3 rounded bg-surface-1/30 flex items-center gap-3">
                  <span className="text-lg">→</span>
                  <span><strong>Swipe Right:</strong> Go to previous step</span>
                </div>
                <div className="p-3 rounded bg-surface-1/30 flex items-center gap-3">
                  <span className="text-lg">👆</span>
                  <span><strong>Tap:</strong> Expand/collapse steps</span>
                </div>
              </div>
            </div>
            
            {/* Tips */}
            <div>
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                💡 Pro Tips
              </h3>
              <div className="space-y-2 text-sm text-text-muted">
                <div className="p-3 rounded bg-surface-1/30">
                  • Click on any step to expand detailed information and recommendations
                </div>
                <div className="p-3 rounded bg-surface-1/30">
                  • Use the search bar to quickly find specific steps, issues, or components
                </div>
                <div className="p-3 rounded bg-surface-1/30">
                  • Filter by phases to focus on specific parts of your build
                </div>
                <div className="p-3 rounded bg-surface-1/30">
                  • Your progress is automatically saved as you work
                </div>
                <div className="p-3 rounded bg-surface-1/30">
                  • Look for the "Apply Fix" buttons to quickly resolve common issues
                </div>
                <div className="p-3 rounded bg-surface-1/30">
                  • Switch between Overview, Detailed, Timeline, and Summary views for different perspectives
                </div>
              </div>
            </div>
            
            {/* FAQ */}
            <div>
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                ❓ Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {[
                  {
                    q: "How do I know if components are compatible?",
                    a: "The guide automatically checks compatibility and shows warnings or errors for any issues."
                  },
                  {
                    q: "Can I change my mind about components?",
                    a: "Yes! You can swap components at any time and the guide will update recommendations."
                  },
                  {
                    q: "What's the difference between Quick Start and Expert mode?",
                    a: "Quick Start shows only essential steps, while Expert mode reveals all technical details."
                  },
                  {
                    q: "How is the build score calculated?",
                    a: "The score considers compatibility, performance, value, and upgrade potential."
                  }
                ].map((faq, index) => (
                  <div key={index} className="p-3 rounded bg-surface-1/30">
                    <div className="font-medium text-text-primary mb-1">{faq.q}</div>
                    <div className="text-sm text-text-muted">{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Glossary component
export const Glossary = ({ 
  term, 
  definition 
}: {
  term: string;
  definition: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="inline">
      <span
        className="border-b border-dotted border-accent/50 cursor-help text-accent hover:border-accent"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {term}
      </span>
      
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 bg-surface-2 border border-border/20 rounded-lg shadow-lg">
          <div className="font-semibold text-text-primary mb-1">{term}</div>
          <div className="text-sm text-text-muted">{definition}</div>
        </div>
      )}
    </span>
  );
};

// Video tutorial integration
export const VideoTutorial = ({ 
  title, 
  videoId, 
  description 
}: {
  title: string;
  videoId: string;
  description: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="card p-4">
      <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-muted mb-4">{description}</p>
      
      <div className="relative aspect-video bg-surface-1/30 rounded-lg overflow-hidden">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            className="w-full h-full"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-colors"
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
