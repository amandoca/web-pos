import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";

import { store } from "../../application/store/store";
import { queryClient } from "./query-client";

// Injeta Redux e React Query em toda a aplicação.
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
