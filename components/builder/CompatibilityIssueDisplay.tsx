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
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                  {issue.message}
                </h4>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${badgeBg}`}>
                  {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {issue.explanation}
              </p>
              {isExpanded && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  {issue.fix && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-600 mb-1">How to fix:</p>
                      <p className="text-sm text-gray-700">{issue.fix}</p>
                    </div>
                  )}
                  {issue.affected && issue.affected.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Affected components:</p>
                      <div className="flex flex-wrap gap-1">
                        {issue.affected.map((item, i) => (
                          <span key={i} className="inline-block text-xs bg-gray-200 px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
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
