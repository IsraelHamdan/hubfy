'use client';
import { useState } from "react";
import { getQueryClient } from "./lib/queryClient";
import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/AuthProvider";

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__?: import('@tanstack/query-core').QueryClient;
  }
}

export function Providers({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState?: any;
}) {
  const [queryClient] = useState(() => getQueryClient());
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors closeButton position="top-right" />
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  );
}