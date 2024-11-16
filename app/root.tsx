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
import { cacheClientLoader } from "remix-client-cache";
import { api } from "~/lib/api";

import { Navbar } from "./components/navbar";
import { Toaster } from "./components/ui/toaster";
import "./tailwind.css";

export const meta: MetaFunction = () => {
  return [{ title: "Workout Tracker" }];
};

export const links: LinksFunction = () => [];

export const loader = async () => {
  const [workouts, exercises] = await Promise.all([
    api.collection("workouts").getFullList({ sort: "-date" }),
    api.collection("exercises").getFullList(),
  ]);

  return { workouts, exercises };
};

export const clientLoader = cacheClientLoader;
(clientLoader as any).hydrate = true;

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
    <>
      {state === "loading" && <div className="loader" />}
      <Outlet />
      <Navbar />
      <Toaster />
    </>
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
