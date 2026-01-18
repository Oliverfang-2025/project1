"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { SectionConfig } from '@/types/section-config';

// Dynamic imports for all section components (code splitting)
const components = {
  AboutSection: dynamic(() => import('./AboutSection'), {
    ssr: true
  }),
  PlanSection: dynamic(() => import('./PlanSection'), {
    ssr: true
  }),
  KnowledgeSection: dynamic(() => import('./KnowledgeSection'), {
    ssr: true
  }),
  InterestSection: dynamic(() => import('./InterestSection'), {
    ssr: true
  }),
  TimelineSection: dynamic(() => import('./TimelineSection'), {
    ssr: true
  }),
};

interface SectionRendererProps {
  section: SectionConfig;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const Component = components[section.component as keyof typeof components];

  if (!Component) {
    console.warn(`Component "${section.component}" not found for section "${section.id}"`);
    return null;
  }

  return <Component key={section.id} />;
}
