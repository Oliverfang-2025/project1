"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Briefcase, GraduationCap, Trophy, Filter } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/components/seo/JsonLd';
import {
  PageWrapper,
  StaggerWrapper,
  StaggerItem,
  HoverCard
} from '@/components/animations';

interface TimelineEvent {
  id: number;
  title_zh: string;
  title_en: string;
  description_zh: string | null;
  description_en: string | null;
  date: string;
  type: 'work' | 'education' | 'achievement';
  sort_order: number;
}

export default function TimelinePage() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: { zh: '全部', en: 'All' }, icon: Filter },
    { value: 'work', label: { zh: '工作', en: 'Work' }, icon: Briefcase },
    { value: 'education', label: { zh: '教育', en: 'Education' }, icon: GraduationCap },
    { value: 'achievement', label: { zh: '成就', en: 'Achievement' }, icon: Trophy }
  ];

  useEffect(() => {
    fetchTimelineEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchTimelineEvents = async () => {
    try {
      setLoading(true);
      const url = filter === 'all'
        ? '/api/timeline'
        : `/api/timeline?type=${filter}`;
      const response = await fetch(url);
      const result = await response.json();
      setEvents(result.data || []);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTitle = (event: TimelineEvent) => {
    return locale === 'zh' ? event.title_zh : event.title_en;
  };

  const getEventDescription = (event: TimelineEvent) => {
    const desc = locale === 'zh' ? event.description_zh : event.description_en;
    return desc || '';
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'work':
        return Briefcase;
      case 'education':
        return GraduationCap;
      case 'achievement':
        return Trophy;
      default:
        return Filter;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'work':
        return 'bg-primary-600';
      case 'education':
        return 'bg-secondary-600';
      case 'achievement':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Generate structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: locale === 'zh' ? '首页' : 'Home', path: '' },
    { name: locale === 'zh' ? '时间线' : 'Timeline', path: '/timeline' }
  ], locale);

  return (
    <PageWrapper className="container mx-auto px-4 py-20">
      {/* Structured Data */}
      <JsonLd data={breadcrumbSchema} />
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('timeline')}</h1>
        <p className="text-gray-400 text-lg">记录职业发展与成长历程</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const isActive = filter === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {option.label[locale as 'zh' | 'en']}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">暂无时间线事件</p>
        </div>
      ) : (
        <StaggerWrapper className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-600 via-secondary-600 to-yellow-500"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {events.map((event, index) => {
                const Icon = getEventIcon(event.type);
                const isEven = index % 2 === 0;
                const iconColor = getEventColor(event.type);

                return (
                  <StaggerItem key={event.id}>
                    <div className={`relative flex items-center ${isEven ? '' : 'md:justify-end'}`}>
                      {/* Icon */}
                      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 z-10">
                        <div className={`w-12 h-12 ${iconColor} rounded-full border-4 border-gray-950 flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className={`ml-16 md:ml-0 ${isEven ? 'md:w-1/2 md:pr-12' : 'md:w-1/2 md:pl-12'}`}>
                        <HoverCard className="h-full">
                          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-gray-700 transition-all shadow-xl">
                            <div className="p-6">
                              {/* Date Badge */}
                              <div className="inline-block mb-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${iconColor} text-white`}>
                                  {formatDate(event.date)}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="text-xl font-bold text-white mb-3">
                                {getEventTitle(event)}
                              </h3>

                              {/* Description */}
                              {getEventDescription(event) && (
                                <p className="text-gray-300 leading-relaxed">
                                  {getEventDescription(event)}
                                </p>
                              )}

                              {/* Type Badge */}
                              <div className="mt-4">
                                <span className="text-xs text-gray-500 uppercase tracking-wide">
                                  {filterOptions.find(opt => opt.value === event.type)?.label[locale as 'zh' | 'en']}
                                </span>
                              </div>
                            </div>
                          </Card>
                        </HoverCard>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </div>
          </div>
        </StaggerWrapper>
      )}
    </PageWrapper>
  );
}
