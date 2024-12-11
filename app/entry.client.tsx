/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */
import { RemixBrowser } from "@remix-run/react";
import { StrictMode, startTransition } from "react";

import { hydrateRoot } from "react-dom/client";
import { CacheAdapter, configureGlobalCache } from "remix-client-cache";

// import { queryClient } from "./root";

class LocalStorageAdapter implements CacheAdapter {
  async getItem(key: string) {
    const value = localStorage.getItem(key);
    if (!value) return;

    return JSON.parse(value);
  }
  async setItem(key: string, value: string) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  async removeItem(key: string) {
    return localStorage.removeItem(key);
  }
}

configureGlobalCache(() => new LocalStorageAdapter());

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
