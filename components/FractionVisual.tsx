
import React from 'react';
import type { VisualFraction } from '../types';

interface FractionVisualProps {
  visual: VisualFraction;
}

const CircleFraction: React.FC<{ visual: VisualFraction }> = ({ visual }) => {
  const { numerator, denominator, color } = visual;
  const size = 100;
  const center = size / 2;
  const radius = size / 2 - 5;
  
  if (denominator === 0) return null;

  const getCoordinatesForPercent = (percent: number) => {
    const x = center + radius * Math.cos(2 * Math.PI * percent);
    const y = center + radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const slices = [];
  const sliceAngle = 1 / denominator;

  for (let i = 0; i < denominator; i++) {
    const startAngle = i * sliceAngle - 0.25; // Start from top
    const endAngle = (i + 1) * sliceAngle - 0.25;
    const [startX, startY] = getCoordinatesForPercent(startAngle);
    const [endX, endY] = getCoordinatesForPercent(endAngle);
    const largeArcFlag = sliceAngle > 0.5 ? 1 : 0;

    const pathData = [
      `M ${center},${center}`, // Move to center
      `L ${startX},${startY}`, // Line to start of arc
      `A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}`, // Arc
      'Z', // Close path
    ].join(' ');

    slices.push(
      <path
        key={i}
        d={pathData}
        fill={i < numerator ? color : '#E5E7EB'}
        stroke="#FFFFFF"
        strokeWidth="2"
      />
    );
  }

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
      {slices}
    </svg>
  );
};

const BarFraction: React.FC<{ visual: VisualFraction }> = ({ visual }) => {
  const { numerator, denominator, color } = visual;
  const width = 100;
  const height = 100;
  const gap = 2;

  if (denominator === 0) return null;
  
  const segmentWidth = (width - (denominator - 1) * gap) / denominator;

  const segments = [];
  for (let i = 0; i < denominator; i++) {
    segments.push(
      <rect
        key={i}
        x={i * (segmentWidth + gap)}
        y="0"
        width={segmentWidth}
        height={height}
        fill={i < numerator ? color : '#E5E7EB'}
        rx="4"
        ry="4"
      />
    );
  }

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      {segments}
    </svg>
  );
};


export const FractionVisual: React.FC<FractionVisualProps> = ({ visual }) => {
  if (visual.shape === 'circle') {
    return <CircleFraction visual={visual} />;
  }
  return <BarFraction visual={visual} />;
};
   