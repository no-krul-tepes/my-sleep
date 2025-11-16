/**
 * Auth.js Setup
 * NextAuth v5 with database support
 */

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
