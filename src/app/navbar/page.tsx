"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Globe } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const navLinks: NavLink[] = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/blog`, label: t('nav.blog') },
    { href: `/${locale}/projects`, label: t('nav.projects') },
    { href: `/${locale}/timeline`, label: t('nav.timeline') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const switchLocale = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '').replace(/^\/+/, '');
    window.location.href = `/${newLocale}${pathWithoutLocale ? '/' + pathWithoutLocale : ''}`;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800 py-2'
        : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className={`text-2xl font-bold transition-colors ${
              isScrolled ? 'text-white' : 'text-white'
            } hover:text-primary-400`}
          >
            OF2088
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative transition-colors duration-200
                    ${isScrolled ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'}
                    ${isActive ? 'text-white font-semibold' : ''}
                  `}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]"></span>
                  )}
                </Link>
              );
            })}

            {/* Language Switcher */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 transition-colors ${
                  isScrolled ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">{locale === 'zh' ? '中文' : 'English'}</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-700">
                <button
                  onClick={() => switchLocale('zh')}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                    locale === 'zh' ? 'text-primary-400 font-semibold' : 'text-gray-300'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => switchLocale('en')}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                    locale === 'en' ? 'text-primary-400 font-semibold' : 'text-gray-300'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Language Switcher (Mobile) */}
            <button
              onClick={() => switchLocale(locale === 'zh' ? 'en' : 'zh')}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Globe className="w-5 h-5" />
            </button>

            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
              aria-label={isMenuOpen ? t('header.close_menu') : t('header.menu')}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 py-3 rounded-lg transition-all duration-200
                    ${isScrolled ? 'hover:bg-gray-800' : 'hover:bg-gray-800/50'}
                    ${isActive
                      ? 'text-primary-400 font-semibold bg-gray-800/50'
                      : isScrolled ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
