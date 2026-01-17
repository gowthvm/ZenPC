/**
 * Compatibility Issue Display Component
 * 
 * Renders errors, warnings, and informational messages from compatibility validation
 * with proper styling and severity levels
 */

'use client';

import React, { useMemo } from 'react';
import { AlertCircle, AlertTriangle, Info, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { CompatibilityIssue } from '@/lib/compatibilityEngine';

interface CompatibilityIssueDisplayProps {
  issues: CompatibilityIssue[];
  onDismiss?: (issueIndex: number) => void;
  compact?: boolean;
  expandedByDefault?: boolean;
}

export const CompatibilityIssueDisplay: React.FC<CompatibilityIssueDisplayProps> = ({
  issues,
  onDismiss,
  compact = false,
  expandedByDefault = false,
}) => {
  const [expandedIndices, setExpandedIndices] = React.useState<Set<number>>(
    new Set(expandedByDefault ? Array.from({ length: issues.length }, (_, i) => i) : [])
  );
  const [dismissedIndices, setDismissedIndices] = React.useState<Set<number>>(new Set());

  // Filter issues by severity
  const issuesByType = useMemo(() => {
    const errors = issues.filter(i => i.severity === 'error' && !dismissedIndices.has(issues.indexOf(i)));
    const warnings = issues.filter(i => i.severity === 'warning' && !dismissedIndices.has(issues.indexOf(i)));
    const infos = issues.filter(i => i.severity === 'info' && !dismissedIndices.has(issues.indexOf(i)));
    return { errors, warnings, infos };
  }, [issues, dismissedIndices]);

  const handleDismiss = (index: number) => {
    setDismissedIndices(prev => new Set([...prev, index]));
    onDismiss?.(index);
  };

  const toggleExpanded = (index: number) => {
    setExpandedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (issues.length === 0) {
    return null;
  }

  const IssueRow: React.FC<{ issue: CompatibilityIssue; index: number }> = ({ issue, index }) => {
    const isExpanded = expandedIndices.has(index);
    
    const iconColor = {
      error: 'text-red-600',
      warning: 'text-amber-600',
      info: 'text-blue-600',
    }[issue.severity];

    const bgColor = {
      error: 'bg-red-50 border-red-200',
      warning: 'bg-amber-50 border-amber-200',
      info: 'bg-blue-50 border-blue-200',
    }[issue.severity];

    const borderColor = {
      error: 'border-l-red-600',
      warning: 'border-l-amber-600',
      info: 'border-l-blue-600',
    }[issue.severity];

    const badgeBg = {
      error: 'bg-red-100 text-red-800',
      warning: 'bg-amber-100 text-amber-800',
      info: 'bg-blue-100 text-blue-800',
    }[issue.severity];

    // Parse explanation to extract incompatible details
    const parseIncompatibilityDetails = (explanation: string) => {
      // Try to extract "X does not match Y" or "X conflicts with Y" patterns
      const patterns = [
        /(?:does not match|conflicts with|incompatible with|requires|must be)\s+(.+?)(?:\.|,|$)/gi,
        /([A-Za-z0-9\s]+)\s+(?:is|has)\s+(.+?)(?:\.|,|$)/gi,
      ];
      
      const details: string[] = [];
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(explanation)) !== null) {
          details.push(match[0].trim());
        }
      });
      return details;
    };

    const incompatibilityDetails = parseIncompatibilityDetails(issue.explanation);

    return (
      <div
        key={index}
        className={`border-l-4 ${borderColor} ${bgColor} border rounded-md p-3 mb-2 transition-all`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`mt-1 flex-shrink-0 ${iconColor}`}>
              {issue.severity === 'error' && <AlertCircle size={20} />}
              {issue.severity === 'warning' && <AlertTriangle size={20} />}
              {issue.severity === 'info' && <Info size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-sm text-gray-900">
                  {issue.message}
                </h4>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${badgeBg}`}>
                  {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                </span>
              </div>
              
              {/* Main explanation */}
              <p className="text-sm text-gray-700 mb-2">
                {issue.explanation}
              </p>

              {/* Extract sections from explanation for errors */}
              {issue.severity === 'error' && (
                <div className="mt-3 space-y-3">
                  {/* Affected components with clear labeling */}
                  {issue.affected && issue.affected.length > 0 && (
                    <div className="p-2 bg-red-100/30 rounded border border-red-200/50">
                      <p className="text-xs font-semibold text-red-700 mb-1">
                        🔴 Involved Components:
                      </p>
                      <div className="space-y-1">
                        {issue.affected.map((item, i) => (
                          <div key={i} className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extract "EXACTLY WHAT'S WRONG" section */}
                  {issue.explanation && issue.explanation.includes('EXACTLY WHAT' + '\'S WRONG') && (
                    <div className="p-2 bg-yellow-100/30 rounded border border-yellow-200/50">
                      <p className="text-xs font-semibold text-yellow-700 mb-1">
                        ⚠️ What&apos;s Incompatible:
                      </p>
                      <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-words">
                        {issue.explanation.split('EXACTLY WHAT' + '\'S WRONG:')[1]?.split('\n\n')[0] || ''}
                      </pre>
                    </div>
                  )}

                  {/* Fix/Solution */}
                  {issue.fix && (
                    <div className="p-2 bg-green-100/30 rounded border border-green-200/50">
                      <p className="text-xs font-semibold text-green-700 mb-2">
                        ✓ What You Must Do:
                      </p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {issue.fix}
                      </p>
                    </div>
                  )}

                  {/* Recommendation if available */}
                  {(issue as any).recommendation && (
                    <div className="p-2 bg-blue-100/30 rounded border border-blue-200/50">
                      <p className="text-xs font-semibold text-blue-700 mb-1">
                        💡 Recommendation:
                      </p>
                      <p className="text-sm text-gray-800">
                        {(issue as any).recommendation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* For warnings/info, show expandable details */}
              {issue.severity !== 'error' && isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                  {/* Affected components */}
                  {issue.affected && issue.affected.length > 0 && (
                    <div className="p-2 bg-gray-100/50 rounded">
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        Components Involved:
                      </p>
                      <div className="space-y-1">
                        {issue.affected.map((item, i) => (
                          <div key={i} className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Incompatibility Details */}
                  {incompatibilityDetails.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Details:
                      </p>
                      <div className="space-y-1 p-2 bg-gray-100/30 rounded">
                        {incompatibilityDetails.map((detail, i) => (
                          <p key={i} className="text-xs text-gray-700">
                            • {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fix/Solution */}
                  {issue.fix && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Solution:
                      </p>
                      <div className="p-2 bg-gray-100/30 rounded">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {issue.fix}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  {(issue as any).recommendation && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Recommendation:
                      </p>
                      <div className="p-2 bg-gray-100/30 rounded">
                        <p className="text-sm text-gray-800">
                          {(issue as any).recommendation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {(issue.fix || (issue.affected && issue.affected.length > 0)) && (
              <button
                onClick={() => toggleExpanded(index)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
            {onDismiss && issue.severity !== 'error' && (
              <button
                onClick={() => handleDismiss(index)}
                className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500 hover:text-gray-700"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (compact && issues.length > 0) {
    const errorCount = issuesByType.errors.length;
    const warningCount = issuesByType.warnings.length;
    const infoCount = issuesByType.infos.length;

    return (
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="text-sm font-semibold text-gray-900 mb-2">
          Compatibility Status
        </div>
        <div className="space-y-1">
          {errorCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-700">
              <AlertCircle size={16} />
              <span>{errorCount} {errorCount === 1 ? 'error' : 'errors'} - Build will not work</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <AlertTriangle size={16} />
              <span>{warningCount} {warningCount === 1 ? 'warning' : 'warnings'} - Performance issues</span>
            </div>
          )}
          {infoCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Info size={16} />
              <span>{infoCount} {infoCount === 1 ? 'tip' : 'tips'} - Best practices</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Errors */}
      {issuesByType.errors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-red-600" />
            <h3 className="font-semibold text-red-900">
              Build Issues ({issuesByType.errors.length})
            </h3>
          </div>
          <div className="ml-6">
            {issuesByType.errors.map((issue, i) => (
              <IssueRow key={i} issue={issue} index={issues.indexOf(issue)} />
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {issuesByType.warnings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 mt-4">
            <AlertTriangle size={18} className="text-amber-600" />
            <h3 className="font-semibold text-amber-900">
              Performance Warnings ({issuesByType.warnings.length})
            </h3>
          </div>
          <div className="ml-6">
            {issuesByType.warnings.map((issue, i) => (
              <IssueRow key={i} issue={issue} index={issues.indexOf(issue)} />
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      {issuesByType.infos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 mt-4">
            <Info size={18} className="text-blue-600" />
            <h3 className="font-semibold text-blue-900">
              Tips & Best Practices ({issuesByType.infos.length})
            </h3>
          </div>
          <div className="ml-6">
            {issuesByType.infos.map((issue, i) => (
              <IssueRow key={i} issue={issue} index={issues.indexOf(issue)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompatibilityIssueDisplay;
