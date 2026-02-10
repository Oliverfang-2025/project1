"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, GraduationCap, Code, Award } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { generatePersonSchema, generateBreadcrumbSchema } from '@/components/seo/JsonLd';
import {
  PageWrapper,
  SectionWrapper,
  StaggerWrapper,
  StaggerItem,
  AnimatedProgress
} from '@/components/animations';

export default function AboutPage() {
  const t = useTranslations('about');
  const nav = useTranslations('nav');
  const locale = useLocale();

  const technicalSkills = [
    { name: 'RTL Design', level: 90 },
    { name: 'UVM Verification', level: 85 },
    { name: 'SystemVerilog', level: 88 },
    { name: 'Python', level: 82 },
    { name: 'Firmware Development', level: 80 },
    { name: 'Timing Analysis', level: 85 }
  ];

  const industrySkills = [
    { name: t('skill_chip_design_flow'), level: 90 },
    { name: t('skill_functional_verification'), level: 88 },
    { name: t('skill_production_management'), level: 85 },
    { name: t('skill_project_coordination'), level: 82 },
    { name: t('skill_technical_documentation'), level: 88 }
  ];

  const experiences = [
    {
      company: t('exp_company'),
      position: t('exp_position'),
      period: t('exp_period'),
      description: t('exp_description')
    }
  ];

  const education = [
    {
      school: t('edu_school'),
      degree: t('edu_degree'),
      major: t('edu_major'),
      period: t('edu_period')
    }
  ];

  const certifications = [
    { name: t('cert_ic_designer'), issuer: t('cert_ic_issuer'), year: '2021' },
    { name: t('cert_pmp'), issuer: t('cert_pmp_issuer'), year: '2023' }
  ];

  // Generate structured data
  const personSchema = generatePersonSchema(locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: nav('home'), path: '' },
    { name: nav('about'), path: '/about' }
  ], locale);

  return (
    <PageWrapper className="container mx-auto px-4 py-20">
      {/* Structured Data */}
      <JsonLd data={personSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SectionWrapper className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('title')}</h1>
        <p className="text-gray-400 text-lg">{t('subtitle')}</p>
      </SectionWrapper>

      <StaggerWrapper className="space-y-12">
        {/* Introduction */}
        <StaggerItem>
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-primary-400">
                <User className="w-6 h-6 mr-3" />
                {t('intro')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                {t('intro_text')}
              </p>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Skills */}
        <StaggerItem>
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-primary-400">
                <Code className="w-6 h-6 mr-3" />
                {t('skills')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Technical Skills */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">{t('technical_skills')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {technicalSkills.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-primary-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <AnimatedProgress
                          value={skill.level}
                          delay={index * 0.1}
                          className="bg-primary-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry Skills */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">{t('industry_skills')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {industrySkills.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-secondary-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <AnimatedProgress
                          value={skill.level}
                          delay={index * 0.1}
                          className="bg-secondary-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Experience */}
        <StaggerItem>
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-primary-400">
                <Briefcase className="w-6 h-6 mr-3" />
                {t('experience')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-4 border-primary-600 pl-6 py-2"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{exp.position}</h3>
                  <p className="text-primary-400 font-medium mb-2">{exp.company}</p>
                  <p className="text-gray-500 text-sm mb-3">{exp.period}</p>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Education */}
        <StaggerItem>
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-primary-400">
                <GraduationCap className="w-6 h-6 mr-3" />
                {t('education')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="border-l-4 border-secondary-600 pl-6 py-2"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{edu.school}</h3>
                  <p className="text-secondary-400 font-medium mb-2">{edu.degree} - {edu.major}</p>
                  <p className="text-gray-500 text-sm">{edu.period}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Certifications */}
        <StaggerItem>
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-primary-400">
                <Award className="w-6 h-6 mr-3" />
                {t('certifications')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-primary-600 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">{cert.name}</h3>
                    <p className="text-gray-400 text-sm">{cert.issuer}</p>
                    <p className="text-gray-500 text-sm mt-2">{cert.year}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerWrapper>
    </PageWrapper>
  );
}
