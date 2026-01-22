'use client';

import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface RadarChartProps {
    data: {
        label: string;
        value: number;
        maxValue?: number;
    }[];
    size?: number;
    color?: string;
    backgroundColor?: string;
    showLabels?: boolean;
    showValues?: boolean;
    animated?: boolean;
    className?: string;
    comparison?: {
        label: string;
        value: number;
        maxValue?: number;
    }[];
    comparisonColor?: string;
}

export const RadarChart = ({
    data,
    size = 200,
    color = 'rgb(99, 112, 241)',
    backgroundColor = 'rgb(var(--surface-2))',
    showLabels = true,
    showValues = false,
    animated = true,
    className = '',
    comparison,
    comparisonColor = 'rgb(139, 92, 246)',
}: RadarChartProps) => {
    const center = size / 2;
    const radius = size * 0.35;
    const labelRadius = size * 0.45;
    const numPoints = data.length;
    const angleStep = (2 * Math.PI) / numPoints;

    // Calculate points for polygon
    const calculatePoints = useCallback((values: typeof data) => {
        return values.map((item, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const normalizedValue = (item.value / (item.maxValue || 100));
            const r = radius * normalizedValue;
            return {
                x: center + r * Math.cos(angle),
                y: center + r * Math.sin(angle),
            };
        });
    }, [angleStep, radius, center]);

    const points = useMemo(() => calculatePoints(data), [data, calculatePoints]);
    const comparisonPoints = useMemo(
        () => comparison ? calculatePoints(comparison) : null,
        [comparison, calculatePoints]
    );

    // Generate polygon path
    const getPolygonPath = (pts: typeof points) => {
        return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    };

    // Generate grid circles
    const gridCircles = [0.25, 0.5, 0.75, 1];

    // Calculate label positions
    const labelPositions = data.map((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        return {
            x: center + labelRadius * Math.cos(angle),
            y: center + labelRadius * Math.sin(angle),
        };
    });

    return (
        <div className={cn('relative inline-block', className)}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background grid circles */}
                {gridCircles.map((scale, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={radius * scale}
                        fill="none"
                        stroke="rgb(var(--border))"
                        strokeOpacity={0.1}
                        strokeWidth={1}
                    />
                ))}

                {/* Axis lines */}
                {data.map((_, index) => {
                    const angle = index * angleStep - Math.PI / 2;
                    const endX = center + radius * Math.cos(angle);
                    const endY = center + radius * Math.sin(angle);
                    return (
                        <line
                            key={index}
                            x1={center}
                            y1={center}
                            x2={endX}
                            y2={endY}
                            stroke="rgb(var(--border))"
                            strokeOpacity={0.1}
                            strokeWidth={1}
                        />
                    );
                })}

                {/* Comparison data polygon */}
                {comparisonPoints && (
                    <motion.path
                        d={getPolygonPath(comparisonPoints)}
                        fill={comparisonColor.replace(')', ', 0.1)').replace('rgb', 'rgba')}
                        stroke={comparisonColor}
                        strokeWidth={1.5}
                        strokeOpacity={0.5}
                        initial={animated ? { opacity: 0 } : undefined}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    />
                )}

                {/* Main data polygon */}
                <motion.path
                    d={getPolygonPath(points)}
                    fill={color.replace(')', ', 0.2)').replace('rgb', 'rgba')}
                    stroke={color}
                    strokeWidth={2}
                    initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                />

                {/* Data points */}
                {points.map((point, index) => (
                    <motion.circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r={4}
                        fill={color}
                        stroke="rgb(var(--bg))"
                        strokeWidth={2}
                        initial={animated ? { scale: 0, opacity: 0 } : undefined}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                    />
                ))}
            </svg>

            {/* Labels */}
            {showLabels && labelPositions.map((pos, index) => (
                <div
                    key={index}
                    className="absolute text-xs text-text-muted whitespace-nowrap"
                    style={{
                        left: pos.x,
                        top: pos.y,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <span className="font-medium">{data[index].label}</span>
                    {showValues && (
                        <span className="ml-1 text-text-primary font-semibold">
                            {data[index].value}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

// Mini Radar for inline use
export const MiniRadar = ({
    data,
    size = 60,
    color = 'rgb(99, 112, 241)',
    className = '',
}: {
    data: number[];
    size?: number;
    color?: string;
    className?: string;
}) => {
    const normalizedData = data.map((v, i) => ({
        label: `${i + 1}`,
        value: v,
        maxValue: 100,
    }));

    return (
        <RadarChart
            data={normalizedData}
            size={size}
            color={color}
            showLabels={false}
            animated={false}
            className={className}
        />
    );
};

export default RadarChart;
