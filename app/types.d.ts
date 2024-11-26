import type { ClientLoaderFunction } from "@remix-run/react";

declare module "remix-client-cache" {
  export const cacheClientLoader: ClientLoaderFunction;
}
