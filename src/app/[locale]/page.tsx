"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import JsonLd from '@/components/seo/JsonLd';
import { generatePersonSchema, generateWebSiteSchema, generateBreadcrumbSchema } from '@/components/seo/JsonLd';
import {
  PageWrapper,
  SectionWrapper,
  StaggerWrapper,
  StaggerItem,
  HoverCard,
  RevealText,
  ScrollIndicator,
  fadeIn,
  staggerItem
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
}

interface Article {
  id: number;
  title_zh: string;
  title_en: string;
  slug: string;
  excerpt_zh: string;
  excerpt_en: string;
  cover_image: string;
  category: string;
  tags: string[];
  view_count: number;
  created_at: string;
}

export default function Home() {
  const t = useTranslations('home');
  const locale = useLocale();
  const [featuredProjects, setFeaturedProjects] = useState([] as Project[]);
  const [latestArticles, setLatestArticles] = useState([] as Article[]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, articlesRes] = await Promise.all([
        fetch('/api/projects?featured=true&limit=3'),
        fetch('/api/articles?status=published&limit=3')
      ]);

      const projectsData = await projectsRes.json();
      const articlesData = await articlesRes.json();

      setFeaturedProjects(projectsData.data || []);
      setLatestArticles(articlesData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getText = (zh: string, en: string) => locale === 'zh' ? zh : en;

  if (!mounted) {
    return null;
  }

  // Generate structured data
  const personSchema = generatePersonSchema(locale);
  const webSiteSchema = generateWebSiteSchema(locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: locale === 'zh' ? '首页' : 'Home', path: '' }
  ], locale);

  return (
    <PageWrapper className="min-h-screen bg-background">
      {/* Structured Data */}
      <JsonLd data={personSchema} />
      <JsonLd data={webSiteSchema} />
      <JsonLd data={breadcrumbSchema} />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <RevealText delay={0.2} className="text-foreground-muted text-lg md:text-xl mb-4">
              {t('hero.greeting')}
            </RevealText>

            <RevealText delay={0.3} className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground-muted bg-clip-text text-transparent">
                {t('hero.name')}
              </span>
            </RevealText>

            <RevealText delay={0.5} className="text-xl md:text-2xl text-foreground-muted mb-4">
              {t('hero.tagline')}
            </RevealText>

            <RevealText delay={0.6} className="text-lg text-foreground-subtle mb-10 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </RevealText>

            <RevealText delay={0.7} className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/projects">{t('hero.view_work')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-foreground-muted">
                <Link href="/contact">{t('hero.contact_me')}</Link>
              </Button>
            </RevealText>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ScrollIndicator />
        </div>
      </section>

      {/* Featured Projects Section */}
      <SectionWrapper className="py-20 md:py-32 bg-background-secondary">
        <div className="container mx-auto px-4">
          <StaggerWrapper className="space-y-12">
            <StaggerItem className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('featured_projects.title')}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-400 mx-auto rounded-full"></div>
            </StaggerItem>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-background-tertiary rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-background-tertiary rounded mb-4"></div>
                      <div className="h-4 bg-background-tertiary rounded mb-2"></div>
                      <div className="h-4 bg-background-tertiary rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredProjects.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {featuredProjects.map((project) => (
                    <StaggerItem key={project.id}>
                      <HoverCard className="h-full">
                        <Card className="h-full hover:border-primary-500 transition-all duration-300 group">
                          <CardHeader className="p-0">
                            {project.cover_image && (
                              <div className="relative h-48 overflow-hidden rounded-t-lg">
                                <Image
                                  src={project.cover_image}
                                  alt={getText(project.title_zh, project.title_en)}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                          </CardHeader>
                          <CardContent className="p-6">
                            <CardTitle className="text-xl mb-2 group-hover:text-primary-500 transition-colors">
                              {getText(project.title_zh, project.title_en)}
                            </CardTitle>
                            <CardDescription className="text-foreground-muted line-clamp-2 mb-4">
                              {getText(project.description_zh, project.description_en)}
                            </CardDescription>
                            {project.tech_stack && project.tech_stack.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {project.tech_stack.slice(0, 3).map((tech, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 text-xs bg-background-tertiary text-foreground-muted rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="p-6 pt-0">
                            <Button asChild variant="ghost" className="w-full group-hover:bg-primary-500/10">
                              <Link href={`/projects/${project.slug}`}>
                                {t('featured_projects.view_project')}
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </HoverCard>
                    </StaggerItem>
                  ))}
                </div>
                <StaggerItem className="text-center">
                  <Button asChild size="lg" variant="outline">
                    <Link href="/projects">{t('featured_projects.view_all')}</Link>
                  </Button>
                </StaggerItem>
              </>
            ) : null}
          </StaggerWrapper>
        </div>
      </SectionWrapper>

      {/* Latest Articles Section */}
      <SectionWrapper className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <StaggerWrapper className="space-y-12">
            <StaggerItem className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('latest_articles.title')}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-400 mx-auto rounded-full"></div>
            </StaggerItem>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-background-tertiary rounded mb-4"></div>
                      <div className="h-4 bg-background-tertiary rounded mb-2"></div>
                      <div className="h-4 bg-background-tertiary rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : latestArticles.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {latestArticles.map((article) => (
                    <StaggerItem key={article.id}>
                      <HoverCard className="h-full">
                        <Card className="h-full hover:border-accent-400 transition-all duration-300 group">
                          <CardContent className="p-6">
                            {article.category && (
                              <span className="inline-block px-3 py-1 text-xs bg-accent-400/10 text-accent-400 rounded-full mb-4">
                                {article.category}
                              </span>
                            )}
                            <CardTitle className="text-xl mb-3 group-hover:text-accent-400 transition-colors line-clamp-2">
                              {getText(article.title_zh, article.title_en)}
                            </CardTitle>
                            <CardDescription className="text-foreground-muted line-clamp-3 mb-4">
                              {getText(article.excerpt_zh, article.excerpt_en)}
                            </CardDescription>
                            <div className="flex items-center justify-between text-sm text-foreground-subtle">
                              <span>{new Date(article.created_at).toLocaleDateString(locale)}</span>
                              <span>{article.view_count} {t('latest_articles.views')}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="p-6 pt-0">
                            <Button asChild variant="ghost" className="w-full group-hover:bg-accent-400/10">
                              <Link href={`/blog/${article.slug}`}>
                                {t('latest_articles.read_more')}
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </HoverCard>
                    </StaggerItem>
                  ))}
                </div>
                <StaggerItem className="text-center">
                  <Button asChild size="lg" variant="outline">
                    <Link href="/blog">{t('latest_articles.view_all')}</Link>
                  </Button>
                </StaggerItem>
              </>
            ) : null}
          </StaggerWrapper>
        </div>
      </SectionWrapper>

      {/* About Preview Section */}
      <SectionWrapper className="py-20 md:py-32 bg-background-secondary">
        <div className="container mx-auto px-4">
          <StaggerWrapper className="max-w-4xl mx-auto text-center">
            <StaggerItem>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('about_preview.title')}</h2>
              <p className="text-lg text-foreground-muted mb-12 leading-relaxed">
                {t('about_preview.description')}
              </p>
            </StaggerItem>

            <StaggerItem className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">{t('about_preview.skills_title')}</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'IC Design', 'UVM', 'FPGA'].map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-background-tertiary border border-border text-foreground rounded-lg hover:border-primary-500 hover:text-primary-500 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </StaggerItem>

            <StaggerItem className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/about">{t('about_preview.learn_more')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">{t('about_preview.contact_btn')}</Link>
              </Button>
            </StaggerItem>
          </StaggerWrapper>
        </div>
      </SectionWrapper>
    </PageWrapper>
  );
}
