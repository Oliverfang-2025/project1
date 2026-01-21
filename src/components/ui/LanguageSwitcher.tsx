"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const otherLocale = locale === 'zh' ? 'en' : 'zh';

  // Remove locale from pathname for switching
  const getPathnameWithoutLocale = () => {
    const segments = pathname.split('/');
    segments.shift(); // Remove empty first element
    if (segments[0] === 'zh' || segments[0] === 'en') {
      segments.shift(); // Remove locale
    }
    return '/' + segments.join('/');
  };

  const pathWithoutLocale = getPathnameWithoutLocale();

  return (
    <Link
      href={`/${otherLocale}${pathWithoutLocale}`}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span className="text-sm font-medium">
        {locale === 'zh' ? 'EN' : '中文'}
      </span>
    </Link>
  );
}
