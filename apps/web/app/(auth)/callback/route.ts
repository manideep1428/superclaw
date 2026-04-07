import { handleAuth } from '@workos-inc/authkit-nextjs';

// Redirect the user to `/dashboard` after successful sign in
export const GET = handleAuth({ returnPathname: '/dashboard' });
