'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

// Performance optimized step renderer with virtualization
export const VirtualizedStepList = ({ 
  steps, 
  itemHeight = 200, 
  containerHeight = 600 
}: {
  steps: any[];
  itemHeight?: number;
  containerHeight?: number;
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    steps.length
  );
  
  const visibleSteps = steps.slice(visibleStart, visibleEnd);
  
  return (
    <div
      style={{ height: containerHeight }}
      className="overflow-auto"
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: steps.length * itemHeight, position: 'relative' }}>
        {visibleSteps.map((step, index) => (
          <div
            key={step.id}
            style={{
              position: 'absolute',
              top: (visibleStart + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {/* Render step content here */}
            <Card className="h-full p-4">
              <h3 className="font-semibold text-text-primary">{step.title}</h3>
              <p className="text-sm text-text-muted">{step.description}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

// Build templates system
export const BuildTemplates = ({ 
  onSelectTemplate 
}: {
  onSelectTemplate: (template: any) => void;
}) => {
  const templates = [
    {
      id: 'gaming_1080p',
      name: '1080p Gaming Rig',
      description: 'Balanced performance for 1080p gaming',
      budget: '$800-1200',
      components: ['CPU', 'GPU', 'RAM', 'Storage'],
      icon: '🎮',
      tags: ['gaming', 'budget', '1080p']
    },
    {
      id: 'productivity',
      name: 'Productivity Workstation',
      description: 'Powerful for work and content creation',
      budget: '$1200-1800',
      components: ['CPU', 'RAM', 'Storage', 'GPU'],
      icon: '💼',
      tags: ['productivity', 'content-creation']
    },
    {
      id: 'streaming',
      name: 'Streaming Setup',
      description: 'Optimized for game streaming and recording',
      budget: '$1500-2500',
      components: ['CPU', 'GPU', 'RAM', 'Storage', 'Capture Card'],
      icon: '📹',
      tags: ['streaming', 'gaming', 'content-creation']
    },
    {
      id: 'ai_workstation',
      name: 'AI/ML Workstation',
      description: 'High-performance for machine learning',
      budget: '$2500-5000',
      components: ['CPU', 'GPU', 'RAM', 'Storage', 'Cooling'],
      icon: '🤖',
      tags: ['ai', 'machine-learning', 'workstation']
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card 
          key={template.id}
          className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onSelectTemplate(template)}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">{template.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-1">{template.name}</h3>
              <p className="text-sm text-text-muted mb-2">{template.description}</p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-accent">{template.budget}</span>
                <div className="flex gap-1">
                  {template.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="text-xs text-text-muted">
                Includes: {template.components.join(', ')}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Component upgrade suggestions
export const UpgradeSuggestions = ({ 
  currentComponents,
  onUpgrade 
}: {
  currentComponents: any[];
  onUpgrade: (component: any, upgrade: any) => void;
}) => {
  const suggestions = useMemo(() => {
    // Generate upgrade suggestions based on current components
    return currentComponents.map((component) => ({
      current: component,
      upgrade: {
        name: `${component.name} Pro`,
        performance: '+25%',
        price: '+$150',
        benefits: ['Better performance', 'Future-proof', 'Better value']
      }
    }));
  }, [currentComponents]);

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-text-primary">{suggestion.current.name}</h4>
              <p className="text-sm text-text-muted">Current component</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-500">{suggestion.upgrade.performance}</div>
              <div className="text-sm text-accent">{suggestion.upgrade.price}</div>
            </div>
          </div>
          
          <div className="space-y-2 mb-3">
            {suggestion.upgrade.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-text-muted">
                <span className="text-green-500">✓</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onUpgrade(suggestion.current, suggestion.upgrade)}
              className="flex-1 py-2 bg-accent text-white rounded-lg text-sm font-medium"
            >
              Upgrade to {suggestion.upgrade.name}
            </button>
            <button className="px-3 py-2 bg-surface-1/50 text-text-primary rounded-lg text-sm font-medium">
              Compare
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Price tracking and alerts
export const PriceTracker = ({ 
  components 
}: {
  components: any[];
}) => {
  const [priceHistory, setPriceHistory] = useState<Record<string, number[]>>({});

  useEffect(() => {
    // Simulate price history data
    const history: Record<string, number[]> = {};
    components.forEach((component) => {
      history[component.id] = [
        component.price * 1.1,
        component.price * 1.05,
        component.price,
        component.price * 0.95,
        component.price * 0.98
      ];
    });
    setPriceHistory(history);
  }, [components]);

  return (
    <div className="space-y-4">
      {components.map((component) => {
        const history = priceHistory[component.id] || [];
        const currentPrice = history[history.length - 1] || component.price;
        const previousPrice = history[history.length - 2] || component.price;
        const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
        
        return (
          <Card key={component.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-text-primary">{component.name}</h4>
                <p className="text-sm text-text-muted">{component.category}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-text-primary">${currentPrice}</div>
                <div className={`text-sm ${priceChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(1)}%
                </div>
              </div>
            </div>
            
            {/* Mini price chart */}
            <div className="h-16 flex items-end gap-1">
              {history.map((price, index) => {
                const maxPrice = Math.max(...history);
                const height = (price / maxPrice) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 bg-accent/30 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-1 bg-surface-1/50 text-text-primary rounded text-sm">
                Set Alert
              </button>
              <button className="flex-1 py-1 bg-surface-1/50 text-text-primary rounded text-sm">
                View History
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// Community build sharing
export const CommunityBuilds = ({ 
  onLoadBuild 
}: {
  onLoadBuild: (build: any) => void;
}) => {
  const communityBuilds = [
    {
      id: 'community_1',
      title: "Ultimate 4K Gaming Beast",
      author: "TechGuru42",
      rating: 4.8,
      downloads: 1234,
      components: 8,
      totalCost: "$2,500",
      tags: ["gaming", "4k", "high-end"],
      description: "Perfect for 4K gaming with max settings"
    },
    {
      id: 'community_2', 
      title: "Budget Content Creator",
      author: "CreativePro",
      rating: 4.6,
      downloads: 892,
      components: 7,
      totalCost: "$1,200",
      tags: ["content-creation", "budget"],
      description: "Great value for video editing and streaming"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {communityBuilds.map((build) => (
        <Card key={build.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-text-primary mb-1">{build.title}</h3>
              <p className="text-sm text-text-muted">by {build.author}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm">
                <span className="text-yellow-500">⭐</span>
                <span>{build.rating}</span>
              </div>
              <div className="text-xs text-text-muted">{build.downloads} downloads</div>
            </div>
          </div>
          
          <p className="text-sm text-text-muted mb-3">{build.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              {build.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <span className="text-sm font-medium text-accent">{build.totalCost}</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onLoadBuild(build)}
              className="flex-1 py-2 bg-accent text-white rounded-lg text-sm font-medium"
            >
              Load Build
            </button>
            <button className="px-3 py-2 bg-surface-1/50 text-text-primary rounded-lg text-sm font-medium">
              Details
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Build comparison tool
export const BuildComparison = ({ 
  builds 
}: {
  builds: any[];
}) => {
  if (builds.length < 2) {
    return (
      <Card className="p-8 text-center">
        <p className="text-text-muted">Select at least 2 builds to compare</p>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/20">
            <th className="text-left p-3 text-text-primary">Feature</th>
            {builds.map((build, index) => (
              <th key={index} className="text-center p-3 text-text-primary">
                Build {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/10">
            <td className="p-3 text-text-muted">Total Cost</td>
            {builds.map((build, index) => (
              <td key={index} className="text-center p-3 font-medium text-text-primary">
                ${build.totalCost}
              </td>
            ))}
          </tr>
          <tr className="border-b border-border/10">
            <td className="p-3 text-text-muted">Performance Score</td>
            {builds.map((build, index) => (
              <td key={index} className="text-center p-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-medium text-text-primary">{build.performance}</span>
                  <Progress value={build.performance} className="w-16 h-2" />
                </div>
              </td>
            ))}
          </tr>
          <tr className="border-b border-border/10">
            <td className="p-3 text-text-muted">Components</td>
            {builds.map((build, index) => (
              <td key={index} className="text-center p-3 text-text-primary">
                {build.components?.length || 0}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Offline functionality indicator
export const OfflineIndicator = ({ 
  isOnline 
}: {
  isOnline: boolean;
}) => {
  return (
    <div className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isOnline 
        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
    }`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'} ${isOnline ? '' : 'animate-pulse'}`}></div>
        <span>{isOnline ? 'Online' : 'Offline - Changes saved locally'}</span>
      </div>
    </div>
  );
};

// Auto-save functionality
export const AutoSaveIndicator = ({ 
  status, 
  lastSaved 
}: {
  status: 'saved' | 'saving' | 'error';
  lastSaved?: Date;
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'saved': return 'text-green-500';
      case 'saving': return 'text-yellow-500';
      case 'error': return 'text-red-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'saved': return '✓';
      case 'saving': return '⟳';
      case 'error': return '✗';
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={getStatusColor()}>
        {status === 'saving' && (
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></div>
        )}
        {status !== 'saving' && getStatusIcon()}
      </span>
      <span className="text-text-muted">
        {status === 'saved' && `Saved ${lastSaved ? `${Math.round((Date.now() - lastSaved.getTime()) / 1000 / 60)} min ago` : 'just now'}`}
        {status === 'saving' && 'Saving...'}
        {status === 'error' && 'Save failed'}
      </span>
    </div>
  );
};
