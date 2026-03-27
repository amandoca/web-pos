import { QueryClient } from "@tanstack/react-query";

// Configura o cache global usado pelo TanStack Query.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Esse tempo define quanto tempo um dado continua "fresco".
      staleTime: 1000 * 30,
      // Esse tempo define quanto tempo o cache é mantido sem uso.
      gcTime: 1000 * 60 * 5,
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});
