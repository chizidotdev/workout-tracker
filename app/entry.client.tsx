/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */
import { StrictMode, startTransition } from "react";

import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import { CacheAdapter, configureGlobalCache } from "remix-client-cache";

import { queryClient } from "./root";

class ReactQueryAdapter implements CacheAdapter {
  async getItem(key: string) {
    return queryClient.getQueryData([key]);
  }
  async setItem(key: string, value: string) {
    return queryClient.setQueryData([key], value);
  }
  async removeItem(key: string) {
    return queryClient.removeQueries({ queryKey: [key] });
  }
}

configureGlobalCache(() => new ReactQueryAdapter());

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
