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
import { QueryClientProvider } from "@tanstack/react-query";
import { Dumbbell } from "lucide-react";

import { Heading } from "./components/ui/text";
import { Toaster } from "./components/ui/toaster";
import { queryClient } from "./lib/api";
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
      <div className="container mt-28">
        <Heading variant="h2">
          {error.status} {error.statusText}
        </Heading>
        <p>{error.data}</p>
      </div>
    );
  }

  return (
    <div className="container mt-28">
      <Heading variant="h2">Error!</Heading>
      <p>{(error as any)?.message ?? "Unknown error"}</p>
    </div>
  );
}

export function HydrateFallback() {
  return (
    <div className="flex h-[50dvh] items-end justify-center">
      <Dumbbell className="size-10 text-primary" />
    </div>
  );
}
