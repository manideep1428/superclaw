import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

// In middleware auth mode, each page is protected by default.
// Exceptions are configured via the `unauthenticatedPaths` option.
export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/', '/about', '/docs', '/contact'],
  },
});

// Match against pages that require authentication
export const config = { 
  matcher: [
    '/',
    '/dashboard/:path*',
    '/account/:path*',
    '/about',
    '/docs',
    '/contact'
  ] 
};
