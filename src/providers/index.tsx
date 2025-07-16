'use client'

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
});

const msalInstance = new PublicClientApplication({
    auth: {
        clientId: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID!,
        authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID}`,
        redirectUri: '/',
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
    },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <MsalProvider instance={msalInstance}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </MsalProvider>
    );
}
