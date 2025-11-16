/**
 * NextAuth API Route
 * Handles all authentication requests
 */

import { handlers } from '@/lib/auth/auth';

export const { GET, POST } = handlers;
