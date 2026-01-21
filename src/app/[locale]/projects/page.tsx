"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PageWrapper,
  StaggerWrapper,
  StaggerItem,
  HoverCard
} from '@/components/animations';

interface Project {
  id: number;
  title_zh: string;
  title_en: string;
  slug: string;
  description_zh: string;
  description_en: string;
  cover_image: string;
  tech_stack: string[];
  demo_url: string;
  github_url: string;
  featured: boolean;
  status: string;
}

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const locale = useLocale();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [filterStatus, setFilterStatus] = useState('published');

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFeatured, filterStatus, searchTerm]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', filterStatus);
      if (filterFeatured !== 'all') {
        params.append('featured', filterFeatured);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/projects?${params.toString()}`);
      const json = await response.json();
      setProjects(json.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectTitle = (project: Project) => {
    return locale === 'zh' ? project.title_zh : project.title_en;
  };

  const getProjectDescription = (project: Project) => {
    return locale === 'zh' ? project.description_zh : project.description_en;
  };

  return (
    <PageWrapper className="container mx-auto px-4 py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('title')}</h1>
        <p className="text-gray-400 text-lg">{t('subtitle')}</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap justify-center md:justify-start">
          <button
            onClick={() => setFilterFeatured('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterFeatured === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {t('filter_all')}
          </button>
          <button
            onClick={() => setFilterFeatured('true')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterFeatured === 'true'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {t('filter_featured')}
          </button>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="text-gray-400 mt-4">{t('loading')}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">{searchTerm ? t('no_results') : t('no_projects')}</p>
        </div>
      ) : (
        <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <Link href={`/${locale}/projects/${project.slug}`} className="block group">
                <HoverCard className="h-full">
                  <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 h-full">
                    <div className="relative h-48 bg-gray-800 overflow-hidden">
                      {project.cover_image ? (
                        <Image
                          src={project.cover_image}
                          alt={getProjectTitle(project)}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900 to-secondary-900">
                          <span className="text-4xl font-bold text-white/20">
                            {getProjectTitle(project).charAt(0)}
                          </span>
                        </div>
                      )}
                      {project.featured && (
                        <div className="absolute top-3 right-3 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                          {t('featured')}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors">
                        {getProjectTitle(project)}
                      </h3>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {getProjectDescription(project) || t('description')}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_stack?.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack?.length > 3 && (
                          <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-md">
                            +{project.tech_stack.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                            {t('live_demo')}
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-gray-400 hover:text-gray-300 text-sm transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-4 h-4" />
                            {t('source_code')}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </HoverCard>
              </Link>
            </StaggerItem>
          ))}
        </StaggerWrapper>
      )}
    </PageWrapper>
  );
}
