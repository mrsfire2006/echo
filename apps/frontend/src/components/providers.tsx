'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5,
                        gcTime: 1000 * 60 * 10,
                        refetchOnWindowFocus: false,
                        retry: 1,
                        refetchOnReconnect: true,
                    },
                    mutations: {
                        retry: false,
                    },
                }
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}