'use client';

import React, { useState, useEffect } from 'react';
import { AdaptiveUXEngine } from '@/lib/adaptiveUXEngine';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

interface DecisionSupportSystemProps {
  adaptiveEngine: AdaptiveUXEngine;
  currentDecision?: {
    type: string;
    context: string;
    options: any[];
  };
  className?: string;
}

export const DecisionSupportSystem: React.FC<DecisionSupportSystemProps> = ({
  adaptiveEngine,
  currentDecision,
  className = ''
}) => {
  const [activeVisualization, setActiveVisualization] = useState<'comparison' | 'impact' | 'confidence'>('comparison');
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());

  // Initialize with mock data when current decision changes
  useEffect(() => {
    if (currentDecision) {
      console.log('Decision support initialized for:', currentDecision.type);
    }
  }, [currentDecision]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(optionId)) {
        newSet.delete(optionId);
      } else {
        newSet.add(optionId);
      }
      return newSet;
    });
  };

  const renderMockComparison = () => {
    return (
      <Card className="comparison-visualization">
        <div className="p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Component Comparison</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mock Option 1 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-text-primary">Option A</h4>
                <Badge variant="success">#1</Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Value</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Compatibility</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm font-medium text-text-primary mb-1">Strengths:</div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="success" className="text-xs">Excellent performance</Badge>
                  <Badge variant="success" className="text-xs">Great value</Badge>
                </div>
              </div>
            </div>

            {/* Mock Option 2 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-text-primary">Option B</h4>
                <Badge variant="outline">#2</Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Value</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Compatibility</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm font-medium text-text-primary mb-1">Strengths:</div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="success" className="text-xs">Top performance</Badge>
                  <Badge variant="success" className="text-xs">Future-proof</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderMockImpact = () => {
    return (
      <Card className="impact-visualization">
        <div className="p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Impact Simulation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current vs Proposed */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Build Changes</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-1/30 rounded">
                  <div>
                    <div className="font-medium text-text-primary">Budget</div>
                    <div className="text-xs text-text-muted">Budget impact based on component price</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500">+$150</div>
                    <Badge variant="warning" className="text-xs">moderate</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-surface-1/30 rounded">
                  <div>
                    <div className="font-medium text-text-primary">Performance</div>
                    <div className="text-xs text-text-muted">Performance impact based on benchmarks</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500">+18%</div>
                    <Badge variant="warning" className="text-xs">moderate</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-surface-1/30 rounded">
                  <div>
                    <div className="font-medium text-text-primary">Compatibility</div>
                    <div className="text-xs text-text-muted">Compatibility impact based on matching</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500">+5%</div>
                    <Badge variant="success" className="text-xs">minor</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Component Changes */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Component Changes</h4>
              <div className="space-y-2">
                <div className="p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text-primary">CPU</span>
                    <span className="text-sm text-text-muted">+$80</span>
                  </div>
                  <div className="text-xs text-text-muted mt-1">Performance upgrade</div>
                </div>
                
                <div className="p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text-primary">GPU</span>
                    <span className="text-sm text-text-muted">+$70</span>
                  </div>
                  <div className="text-xs text-text-muted mt-1">Gaming performance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="mt-6 p-4 bg-surface-1/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-text-primary">Simulation Confidence</h4>
                <p className="text-sm text-text-muted">Based on available data and models</p>
              </div>
              <div className="text-2xl font-bold text-accent">
                85%
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderMockConfidence = () => {
    return (
      <Card className="confidence-scoring">
        <div className="p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Confidence Analysis</h3>
          
          {/* Overall Score */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-green-500">
              78%
            </div>
            <p className="text-text-muted">Overall Confidence</p>
          </div>

          {/* Factor Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary">Contributing Factors</h4>
            
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text-primary">Data Quality</span>
                  <span className="text-sm text-text-muted">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="text-xs text-text-muted w-16 text-right">
                25%
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text-primary">User History</span>
                  <span className="text-sm text-text-muted">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div className="text-xs text-text-muted w-16 text-right">
                20%
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text-primary">Expert Consensus</span>
                  <span className="text-sm text-text-muted">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="text-xs text-text-muted w-16 text-right">
                25%
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6">
            <h4 className="font-medium text-text-primary mb-2">Recommendations</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2 bg-surface-1/30 rounded">
                <span className="text-accent">•</span>
                <span className="text-sm text-text-primary">Good confidence in recommendations</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-surface-1/30 rounded">
                <span className="text-accent">•</span>
                <span className="text-sm text-text-primary">Consider additional research for critical components</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className={`decision-support-system ${className}`}>
      {/* Visualization Type Selector */}
      <div className="flex gap-2 mb-4">
        {(['comparison', 'impact', 'confidence'] as const).map(type => (
          <button
            key={type}
            onClick={() => setActiveVisualization(type)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeVisualization === type
                ? 'bg-accent text-white'
                : 'bg-surface-1/50 text-text-muted hover:text-text-primary'
            }`}
          >
            {type === 'comparison' ? '📊 Comparison' :
             type === 'impact' ? '📈 Impact' : '🎯 Confidence'}
          </button>
        ))}
      </div>

      {/* Visualizations */}
      <div className="space-y-6">
        {activeVisualization === 'comparison' && renderMockComparison()}
        {activeVisualization === 'impact' && renderMockImpact()}
        {activeVisualization === 'confidence' && renderMockConfidence()}
      </div>
    </div>
  );
};

export default DecisionSupportSystem;