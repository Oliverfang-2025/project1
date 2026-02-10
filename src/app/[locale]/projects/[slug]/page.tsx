"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { generateProjectSchema, generateBreadcrumbSchema } from '@/components/seo/JsonLd';

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
  created_at: string;
}

export default function ProjectDetailPage() {
  const t = useTranslations('projects');
  const nav = useTranslations('nav');
  const locale = useLocale();
  const params = useParams();
  const { slug } = params;

  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ensure slug is a string
  const slugStr = Array.isArray(slug) ? slug[0] : slug;

  useEffect(() => {
    if (slugStr) {
      fetchProject();
      fetchRelatedProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugStr]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${slugStr}`);
      const json = await response.json();
      setProject(json.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProjects = async () => {
    try {
      const response = await fetch('/api/projects?status=published&limit=3');
      const json = await response.json();
      setRelatedProjects((json.data || []).filter((p: Project) => p.slug !== slugStr));
    } catch (error) {
      console.error('Error fetching related projects:', error);
    }
  };

  const getProjectTitle = (proj: Project) => {
    return locale === 'zh' ? proj.title_zh : proj.title_en;
  };

  const getProjectDescription = (proj: Project) => {
    return locale === 'zh' ? proj.description_zh : proj.description_en;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="text-gray-400 mt-4">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">{t('no_results')}</p>
          <Link href={`/${locale}/projects`} className="inline-block mt-6 text-primary-400 hover:text-primary-300">
            {t('back_to_list')}
          </Link>
        </div>
      </div>
    );
  }

  // Generate structured data
  const projectSchema = generateProjectSchema(project, locale);
  const projectTitle = getProjectTitle(project);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: nav('home'), path: '' },
    { name: nav('projects'), path: '/projects' },
    { name: projectTitle, path: `/projects/${slugStr}` }
  ], locale);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Structured Data */}
      <JsonLd data={projectSchema} />
      <JsonLd data={breadcrumbSchema} />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-8"
      >
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back_to_list')}
        </Link>
      </motion.div>

      <article className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden bg-gray-800 mb-8">
            {project.cover_image ? (
              <Image
                src={project.cover_image}
                alt={getProjectTitle(project)}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900 to-secondary-900">
                <span className="text-8xl font-bold text-white/20">
                  {getProjectTitle(project).charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            {project.featured && (
              <span className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
                {t('featured')}
              </span>
            )}
            <span className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              {new Date(project.created_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {getProjectTitle(project)}
          </h1>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary-400" />
            {t('tech_stack')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.tech_stack?.map((tech, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:border-primary-500 hover:text-primary-400 transition-all"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">{t('description')}</h2>
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {getProjectDescription(project) || t('no_results')}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">{t('links')}</h2>
          <div className="flex flex-wrap gap-4">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                {t('live_demo')}
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <Github className="w-5 h-5" />
                {t('source_code')}
              </a>
            )}
          </div>
        </motion.div>

        {relatedProjects.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">{t('related_projects')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((related) => (
                <Link
                  key={related.id}
                  href={`/${locale}/projects/${related.slug}`}
                  className="group"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500/50 transition-all h-full"
                  >
                    <div className="relative h-32 bg-gray-800">
                      {related.cover_image ? (
                        <Image
                          src={related.cover_image}
                          alt={getProjectTitle(related)}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900 to-secondary-900">
                          <span className="text-3xl font-bold text-white/20">
                            {getProjectTitle(related).charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                        {getProjectTitle(related)}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {related.tech_stack?.slice(0, 2).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </article>
    </div>
  );
}
