import { useMsal } from '@azure/msal-react';

export function useAuth() {
  const { instance, accounts } = useMsal();

  const getAccessToken = async () => {
    const response = await instance.acquireTokenSilent({
      scopes: ['user.read'],
      account: accounts[0],
    });
    return response.accessToken;
  };

  return {
    account: accounts[0],
    getAccessToken,
  };
}
