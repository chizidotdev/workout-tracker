import { createCookie, redirect } from "@remix-run/node";

import PocketBase from "pocketbase";

import { config } from "./config";
import { TypedPocketBase, UsersResponse } from "./types";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const authCookie = createCookie(config.authCookieName, {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: MAX_AGE,
});

export async function loadAPI(request: Request) {
  const api = new PocketBase(config.apiUrl) as TypedPocketBase;
  api.autoCancellation(false);

  const cookie = await authCookie.parse(request.headers.get("Cookie") || "");
  api.authStore.loadFromCookie(cookie);
  api.authStore.onChange(async () => {
    request.headers.append(
      "Set-Cookie",
      await authCookie.serialize(api.authStore.exportToCookie())
    );
  });

  try {
    if (api.authStore.isValid) await api.collection("users").authRefresh();
  } catch (e) {
    console.log(e);
    api.authStore.clear();
  }

  return api;
}

export async function requireAuth(api: TypedPocketBase): Promise<UsersResponse | never> {
  const userData = api.authStore.model as UsersResponse;

  if (!userData?.id) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await authCookie.serialize("", { maxAge: -1 }),
      },
    });
  }

  return userData;
}

export function parseError(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again";
}
