import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes (/api)
  // - Admin routes (/admin)
  // - _next (Next.js internals)
  // - Static files
  matcher: [
    '/((?!api|admin|_next/static|_next/image|favicon.ico).*)',
  ]
};
