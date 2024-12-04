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

import { Dumbbell } from "lucide-react";

import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { Heading } from "~/components/ui/text";

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

        <link rel="icon" type="image/png" href="/assets/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
        <link rel="shortcut icon" href="/assets/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Track" />
        <link rel="manifest" href="/assets/site.webmanifest" />

        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { state } = useNavigation();

  return (
    <>
      {state === "loading" && <div className="loader" />}
      <Outlet />
      <Toaster />
    </>
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
