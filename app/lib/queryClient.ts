import { QueryClient } from '@tanstack/react-query';

let browserQueryClient: QueryClient | undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minuto
        refetchOnWindowFocus: true,
        retry: false,
      },
    },
  });
}

export function getQueryClient() {
  // Server: sempre cria um novo
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }

  // Browser: reutiliza a mesma instância
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
