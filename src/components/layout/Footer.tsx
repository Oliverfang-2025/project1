"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
  Send,
  Heart
} from 'lucide-react';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState([] as SocialLink[]);
  const [email, setEmail] = useState('');
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    // Fetch social links from API
    fetch('/api/site-config?key=social_links')
      .then(res => res.json())
      .then(data => {
        if (data.data?.value) {
          setSocialLinks(data.data.value);
        }
      })
      .catch(err => {
        console.error('Failed to fetch social links:', err);
        // Fallback to localStorage
        if (typeof window !== 'undefined') {
          const storedLinks = localStorage.getItem('social_links');
          if (storedLinks) {
            try {
              setSocialLinks(JSON.parse(storedLinks));
            } catch (error) {
              console.error('Failed to parse social_links:', error);
            }
          }
        }
      });
  }, []);

  const handleSubscribe = (e: any) => {
    e.preventDefault();
    // TODO: Implement subscription logic
    console.log('Subscribe with email:', email);
    setEmail('');
  };

  const getSocialIcon = (iconName: string) => {
    const iconClass = "w-5 h-5";
    switch (iconName) {
      case 'github':
        return <Github className={iconClass} />;
      case 'linkedin':
        return <Linkedin className={iconClass} />;
      case 'email':
        return <Mail className={iconClass} />;
      case 'twitter':
        return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
      case 'youtube':
        return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
      case 'bilibili':
        return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773h-2.46a.589.589 0 0 1-.587-.587c0-.32.267-.587.587-.587h2.46c1.067.024 1.964.351 2.693.98.73.629 1.102 1.52 1.12 2.675v7.52c-.018 1.155-.39 2.047-1.12 2.675-.729.63-1.626.957-2.693.981H5.333c-1.067-.024-1.964-.351-2.693-.98-.73-.628-1.102-1.52-1.12-2.676v-7.52c.018-1.155.39-2.047 1.12-2.676.729-.629 1.626-.956 2.693-.98h2.46c.32 0 .587.267.587.587 0 .32-.267.587-.587.587h-2.46zm7.56 3.413c.32 0 .587.267.587.587v3.84c0 .32-.267.587-.587.587h-.587a.589.589 0 0 1-.587-.587v-3.84c0-.32.267-.587.587-.587h.587zm3.413 0c.32 0 .587.267.587.587v3.84c0 .32-.267.587-.587.587h-.587a.589.589 0 0 1-.587-.587v-3.84c0-.32.267-.587.587-.587h.587z"/></svg>;
      case 'wechat':
        return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .186-.059l2.257-1.34a.588.588 0 0 1 .45-.05 9.522 9.522 0 0 0 2.73.402c.175 0 .328-.026.5-.026-.207-.618-.328-1.266-.328-1.929 0-3.783 3.612-6.864 8.084-6.864.264 0 .514.025.764.05-.449-3.563-4.04-6.729-8.269-6.729zm-5.194 9.51a.98.98 0 0 1-.972-.982.98.98 0 0 1 .972-.982.98.98 0 0 1 .971.982.98.98 0 0 1-.971.981zm2.99 0a.98.98 0 0 1-.972-.982.98.98 0 0 1 .971-.982.98.98 0 0 1 .972.982.98.98 0 0 1-.972.981zm12.698 3.89c3.697 0 6.805 2.76 6.805 6.137 0 1.844-.99 3.499-2.533 4.637a.495.495 0 0 0-.186.554l.342 1.23c.018.059.04.118.04.177 0 .136-.109.246-.245.246a.27.27 0 0 1-.156-.05l-1.885-1.116a.49.49 0 0 0-.371-.04 7.98 7.98 0 0 1-1.811.209c-3.697 0-6.806-2.76-6.806-6.136 0-3.378 3.109-6.137 6.806-6.137zm-4.285 6.137a.818.818 0 0 0 .812-.818.818.818 0 0 0-.812-.817.818.818 0 0 0-.813.817.818.818 0 0 0 .813.818zm2.537 0a.818.818 0 0 0 .813-.818.818.818 0 0 0-.813-.817.818.818 0 0 0-.812.817.818.818 0 0 0 .812.818z"/></svg>;
      default:
        return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 overflow-hidden relative border-t border-gray-800">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Footer top */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 pb-12 border-b border-gray-800">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-3xl font-bold mb-3 text-white">OF2088</h2>
            <p className="text-gray-400 max-w-md">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/about`}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/10 border border-gray-700"
            >
              {t('nav.about')}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/10 border border-gray-700"
            >
              {t('nav.blog')}
            </Link>
            <Link
              href={`/${locale}/projects`}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/10 border border-gray-700"
            >
              {t('nav.projects')}
            </Link>
            <Link
              href={`/${locale}/timeline`}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/10 border border-gray-700"
            >
              {t('nav.timeline')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25"
            >
              {t('nav.contact')}
            </Link>
          </div>
        </div>

        {/* Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800 inline-block text-white">
              {t('footer.about')}
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>

            <div className="flex space-x-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 hover:bg-primary-600 transition-all duration-200 border border-gray-700 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/25 group"
                  title={link.name}
                >
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    {getSocialIcon(link.icon)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800 inline-block text-white">
              {t('footer.quick_links')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 mr-2 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 mr-2 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 mr-2 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/projects`}
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 mr-2 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('nav.projects')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/timeline`}
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 mr-2 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('nav.timeline')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800 inline-block text-white">
              {t('footer.contact_info')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-400">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3 flex-shrink-0 border border-gray-700">
                  <Mail className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm">635800070@qq.com</p>
                </div>
              </li>
              <li className="flex items-start text-gray-400">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3 flex-shrink-0 border border-gray-700">
                  <Phone className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm">+86 136 7904 1859</p>
                </div>
              </li>
              <li className="flex items-start text-gray-400">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3 flex-shrink-0 border border-gray-700">
                  <MapPin className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm">{t('footer.location')}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800 inline-block text-white">
              {t('footer.subscribe')}
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              {t('footer.subscribe_desc')}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.email_placeholder')}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-700 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-500 text-white p-2 rounded-md transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {t('footer.privacy_notice')}
              </p>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <p className="flex items-center">
              © {new Date().getFullYear()} OF2088.top {t('footer.copyright')}
            </p>
            <span className="hidden sm:inline text-gray-700">|</span>
            <p className="flex items-center">
              {t('footer.powered_by')}{' '}
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
              by Oliver Fang
            </p>
          </div>
          <div className="mt-4 flex justify-center space-x-6">
            <Link href={`/${locale}/privacy`} className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href={`/${locale}/terms`} className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
