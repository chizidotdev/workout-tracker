import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { api } from "~/lib/api";

import { Navbar } from "./components/navbar";
import { Toaster } from "./components/ui/toaster";
import "./tailwind.css";

export const meta: MetaFunction = () => {
  return [{ title: "Workout Tracker" }];
};

export const links: LinksFunction = () => [];

export const clientLoader = async ({}: ClientLoaderFunctionArgs) => {
  const [workouts, exercises] = await Promise.all([
    api.collection("workouts").getFullList({ sort: "-date" }),
    api.collection("exercises").getFullList(),
  ]);

  return { workouts, exercises };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { state } = useNavigation();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {state === "loading" && <div className="loader" />}
        {children}

        <Navbar />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
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
