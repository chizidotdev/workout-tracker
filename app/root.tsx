import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "./components/ui/toaster";
import "./tailwind.css";

export const meta: MetaFunction = () => {
  return [{ title: "Workout Tracker" }];
};

export const links: LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // 1000 * 60 * 10,
    },
  },
});

export default function App() {
  const { state } = useNavigation();

  return (
    <QueryClientProvider client={queryClient}>
      {state === "loading" && <div className="loader" />}
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  }

  return (
    <>
      <h1>Error!</h1>
      <p>{(error as any)?.message ?? "Unknown error"}</p>
    </>
  );
}
