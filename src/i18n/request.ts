import {getRequestConfig} from 'next-intl/server';

const locales = ['zh', 'en'];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale || 'zh';

  // Validate locale against whitelist
  if (!locales.includes(locale)) {
    return {
      locale: 'zh',
      messages: (await import('../../messages/zh.json')).default
    };
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
