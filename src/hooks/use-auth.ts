'use client';

import { useState, useEffect } from 'react';
import { getAuthToken, parseJwt, isAuthenticated } from '@/lib/auth';
import { env } from '@/lib/env';

/**
 * Interface for user information from JWT
 */
export interface UserInfo {
  userid?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  entId?: string;
  email?: string;
  [key: string]: any; // Allow for additional fields
}

/**
 * Hook for accessing authentication state
 */
export function useAuth() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated
    const auth = isAuthenticated();
    setIsAuth(auth);

    if (auth) {
      const token = getAuthToken();
      if (token) {
        const parsedInfo = parseJwt(token);
        setUserInfo(parsedInfo);
      }
    }

    setLoading(false);
  }, []);

  return {
    isAuthenticated: isAuth,
    userInfo: userInfo ? {
      ...userInfo,
      // Ensure email is always present, falling back to the environment variable
      email: userInfo.email || env.defaultUserEmail || 'default@example.com'
    } : null,
    loading,
    defaultTenantId: env.defaultTenantId,
    defaultApproverCode: env.defaultApproverCode
  };
}
