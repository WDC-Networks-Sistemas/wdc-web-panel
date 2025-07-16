// src/features/auth/hooks/useAuth.ts
import { useMsal } from '@azure/msal-react';

export function useAuth() {
  const { instance, accounts } = useMsal();

  const login = async () => {
    await instance.loginRedirect({
      scopes: ['user.read'],
    });
  };

  const logout = () => instance.logout();

  const getToken = async () => {
    const result = await instance.acquireTokenSilent({
      scopes: ['user.read'],
      account: accounts[0],
    });
    return result.accessToken;
  };

  return {
    account: accounts[0],
    login,
    logout,
    getToken,
  };
}
