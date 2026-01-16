'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useBuilderStore } from '@/store/builder';
import { evaluateCompatibility } from '@/lib/compatibilityEngine';
import { getSpecValue, getSpecsForCategory } from '@/lib/specDictionary';

interface CompatibilityNode {
  id: string;
  category: string;
  part: any;
  x: number;
  y: number;
  label: string;
}

interface CompatibilityEdge {
  source: string;
  target: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  rule?: any;
  message?: string;
  explanation?: string;
}

interface CompatibilityMapProps {
  className?: string;
}

const PART_CATEGORIES = [
  { key: 'cpu', label: 'CPU', icon: '🔧' },
  { key: 'motherboard', label: 'Motherboard', icon: '🔌' },
  { key: 'ram', label: 'RAM', icon: '💾' },
  { key: 'gpu', label: 'GPU', icon: '🎮' },
  { key: 'storage', label: 'Storage', icon: '💿' },
  { key: 'psu', label: 'PSU', icon: '⚡' },
  { key: 'case', label: 'Case', icon: '📦' },
];

const LAYOUT_POSITIONS = {
  cpu: { x: 200, y: 100 },
  motherboard: { x: 200, y: 200 },
  ram: { x: 100, y: 200 },
  gpu: { x: 300, y: 200 },
  storage: { x: 100, y: 300 },
  psu: { x: 300, y: 300 },
  case: { x: 200, y: 400 },
};

export const CompatibilityMap: React.FC<CompatibilityMapProps> = ({ className = '' }) => {
  const { selected } = useBuilderStore();
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [compatibilityData, setCompatibilityData] = useState<any>({ issues: [], confirmations: [] });

  // Update compatibility data when parts change
  React.useEffect(() => {
    const updateCompatibility = async () => {
      try {
        console.log('🗺️ CompatibilityMap: Updating compatibility for parts:', selected);
        const result = await evaluateCompatibility(selected);
        console.log('🗺️ CompatibilityMap: Got compatibility result:', result);
        setCompatibilityData(result);
      } catch (error) {
        console.error('❌ CompatibilityMap: Error evaluating compatibility:', error);
        setCompatibilityData({ issues: [], confirmations: [] });
      }
    };
    
    const timer = setTimeout(updateCompatibility, 300);
    return () => clearTimeout(timer);
  }, [selected]);

  // Generate nodes from selected parts
  const nodes = useMemo(() => {
    const nodeList: CompatibilityNode[] = [];
    
    PART_CATEGORIES.forEach(({ key, label, icon }) => {
      const part = selected[key];
      if (part) {
        const position = LAYOUT_POSITIONS[key as keyof typeof LAYOUT_POSITIONS];
        nodeList.push({
          id: key,
          category: key,
          part,
          x: position.x,
          y: position.y,
          label: `${icon} ${label}`,
        });
      }
    });
    
    return nodeList;
  }, [selected]);

  // Generate edges from compatibility rules
  const edges = useMemo(() => {
    const edgeList: CompatibilityEdge[] = [];
    
    // Add edges for all possible connections
    const connections = [
      ['cpu', 'motherboard'],
      ['ram', 'motherboard'],
      ['gpu', 'motherboard'],
      ['storage', 'motherboard'],
      ['psu', 'motherboard'],
      ['case', 'motherboard'],
      ['gpu', 'case'],
      ['psu', 'case'],
    ];

    connections.forEach(([source, target]) => {
      if (selected[source] && selected[target]) {
        // Check if there are any compatibility issues
        const issue = compatibilityData.issues.find(
          (issue: any) => 
            (issue.affected.includes(source) && issue.affected.includes(target)) ||
            (issue.affected.includes(target) && issue.affected.includes(source))
        );
        
        // Check if there are confirmations
        const confirmation = compatibilityData.confirmations.find(
          (conf: any) => 
            (conf.type.toLowerCase().includes(source) || conf.type.toLowerCase().includes(target))
        );

        let severity: CompatibilityEdge['severity'] = 'success';
        let message, explanation, rule;

        if (issue) {
          severity = issue.severity;
          message = issue.message;
          explanation = issue.explanation;
          rule = issue.rule_id;
        } else if (confirmation) {
          severity = 'success';
          message = confirmation.message;
          explanation = confirmation.explanation;
        }

        edgeList.push({
          source,
          target,
          severity,
          rule,
          message,
          explanation,
        });
      }
    });

    return edgeList;
  }, [selected, compatibilityData]);

  const getEdgeColor = (severity: CompatibilityEdge['severity']) => {
    switch (severity) {
      case 'error': return '#ef4444';
      case 'warning': return '#eab308';
      case 'info': return '#3b82f6';
      case 'success': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getEdgeStroke = (severity: CompatibilityEdge['severity']) => {
    switch (severity) {
      case 'error': return 3;
      case 'warning': return 2;
      case 'info': return 2;
      case 'success': return 2;
      default: return 1;
    }
  };

  const handleEdgeClick = useCallback((edgeId: string) => {
    setSelectedEdge(selectedEdge === edgeId ? null : edgeId);
  }, [selectedEdge]);

  const getEdgeId = (edge: CompatibilityEdge) => `${edge.source}-${edge.target}`;

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Compatibility Map</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-text-muted">Compatible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-text-muted">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-text-muted">Error</span>
          </div>
        </div>
      </div>

      {nodes.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <div className="text-4xl mb-4">🔗</div>
          <p>Select parts to see compatibility relationships</p>
        </div>
      ) : (
        <div className="relative">
          <svg
            width="400"
            height="500"
            viewBox="0 0 400 500"
            className="w-full h-auto max-w-md mx-auto"
          >
            {/* Render edges */}
            {edges.map((edge) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              
              if (!sourceNode || !targetNode) return null;
              
              const edgeId = getEdgeId(edge);
              const isHovered = hoveredEdge === edgeId;
              const isSelected = selectedEdge === edgeId;
              
              return (
                <g key={edgeId}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={getEdgeColor(edge.severity)}
                    strokeWidth={getEdgeStroke(edge.severity)}
                    strokeOpacity={isHovered || isSelected ? 1 : 0.6}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredEdge(edgeId)}
                    onMouseLeave={() => setHoveredEdge(null)}
                    onClick={() => handleEdgeClick(edgeId)}
                  />
                  {(isHovered || isSelected) && edge.message && (
                    <g>
                      <rect
                        x={(sourceNode.x + targetNode.x) / 2 - 75}
                        y={(sourceNode.y + targetNode.y) / 2 - 20}
                        width="150"
                        height="40"
                        fill="rgb(var(--surface-2))"
                        stroke="rgb(var(--border))"
                        strokeWidth="1"
                        rx="8"
                        className="backdrop-blur-glass"
                      />
                      <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2 - 5}
                        textAnchor="middle"
                        className="fill-text-primary text-xs font-medium"
                      >
                        {edge.severity === 'error' ? '❌' : edge.severity === 'warning' ? '⚠️' : '✅'}
                      </text>
                      <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2 + 10}
                        textAnchor="middle"
                        className="fill-text-muted text-xs"
                      >
                        {edge.message.length > 20 ? edge.message.substring(0, 20) + '...' : edge.message}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            
            {/* Render nodes */}
            {nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="30"
                  fill="rgb(var(--surface-1))"
                  stroke="rgb(var(--accent))"
                  strokeWidth="2"
                  className="cursor-pointer hover:fill-accent/10 transition-all duration-200"
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className="fill-text-primary text-sm font-medium pointer-events-none"
                >
                  {node.label.split(' ')[0]}
                </text>
                <text
                  x={node.x}
                  y={node.y + 45}
                  textAnchor="middle"
                  className="fill-text-muted text-xs pointer-events-none"
                >
                  {node.part.name?.length > 15 ? node.part.name.substring(0, 15) + '...' : node.part.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Selected edge details */}
          {selectedEdge && (
            <div className="mt-6 p-4 rounded-lg border border-border/20 bg-surface-2/30 backdrop-blur-glass">
              <h4 className="font-medium text-text-primary mb-2">Connection Details</h4>
              {(() => {
                const edge = edges.find(e => getEdgeId(e) === selectedEdge);
                if (!edge) return null;
                
                return (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-${edge.severity === 'error' ? 'red' : edge.severity === 'warning' ? 'yellow' : 'green'}-500`}></span>
                      <span className="text-sm font-medium capitalize text-text-primary">
                        {edge.severity}
                      </span>
                    </div>
                    {edge.message && (
                      <p className="text-sm text-text-primary">{edge.message}</p>
                    )}
                    {edge.explanation && (
                      <p className="text-xs text-text-muted">{edge.explanation}</p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
