"use client";

import React from 'react';

interface ChipShapeProps {
  size?: number;
  className?: string;
}

export default function ChipShape({ size = 120, className = '' }: ChipShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chip body */}
      <rect x="30" y="30" width="60" height="60" fill="none" stroke="#0066CC" strokeWidth="2" />

      {/* Gold wire connections - pins */}
      <g stroke="#d4a853" strokeWidth="1.5">
        {/* Top pins */}
        <line x1="35" y1="30" x2="35" y2="20" />
        <line x1="45" y1="30" x2="45" y2="20" />
        <line x1="55" y1="30" x2="55" y2="20" />
        <line x1="65" y1="30" x2="65" y2="20" />
        <line x1="75" y1="30" x2="75" y2="20" />
        <line x1="85" y1="30" x2="85" y2="20" />

        {/* Bottom pins */}
        <line x1="35" y1="90" x2="35" y2="100" />
        <line x1="45" y1="90" x2="45" y2="100" />
        <line x1="55" y1="90" x2="55" y2="100" />
        <line x1="65" y1="90" x2="65" y2="100" />
        <line x1="75" y1="90" x2="75" y2="100" />
        <line x1="85" y1="90" x2="85" y2="100" />

        {/* Left pins */}
        <line x1="30" y1="35" x2="20" y2="35" />
        <line x1="30" y1="45" x2="20" y2="45" />
        <line x1="30" y1="55" x2="20" y2="55" />
        <line x1="30" y1="65" x2="20" y2="65" />
        <line x1="30" y1="75" x2="20" y2="75" />
        <line x1="30" y1="85" x2="20" y2="85" />

        {/* Right pins */}
        <line x1="90" y1="35" x2="100" y2="35" />
        <line x1="90" y1="45" x2="100" y2="45" />
        <line x1="90" y1="55" x2="100" y2="55" />
        <line x1="90" y1="65" x2="100" y2="65" />
        <line x1="90" y1="75" x2="100" y2="75" />
        <line x1="90" y1="85" x2="100" y2="85" />
      </g>

      {/* Internal circuit */}
      <rect
        x="40"
        y="40"
        width="40"
        height="40"
        fill="rgba(0, 194, 255, 0.1)"
        stroke="#00C2FF"
        strokeWidth="1"
      />
      <circle cx="60" cy="60" r="8" fill="rgba(0, 194, 255, 0.3)" />
      <circle cx="60" cy="60" r="4" fill="#0066CC" />
    </svg>
  );
}
