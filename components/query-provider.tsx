'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode, useState } from 'react';

// Custom error logging (optional)
const queryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
            refetchOnWindowFocus: false,
            retry: 2,
            suspense: true,
        },
        mutations: {
            retry: 1,
        },
    },
};

export function QueryProvider({ children }: { children: ReactNode }) {
    // Ensure a single QueryClient instance per provider
    const [queryClient] = useState(() => new QueryClient(queryClientConfig));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}