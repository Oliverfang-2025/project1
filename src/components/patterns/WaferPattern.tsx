"use client";

import React from 'react';

interface WaferPatternProps {
  className?: string;
}

export default function WaferPattern({ className = '' }: WaferPatternProps) {
  return (
    <div className={`relative w-64 h-64 ${className}`}>
      {/* Wafer body */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border-4 border-primary-500/30" />

      {/* Chip cutting lines - grid pattern */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="wafer-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#0066CC"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#wafer-grid)" />
      </svg>

      {/* Flat notch marker */}
      <div className="absolute top-1/2 left-0 w-4 h-8 bg-primary-500/40 -translate-y-1/2 rounded-r" />
    </div>
  );
}
