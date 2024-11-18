import { remember } from "@epic-web/remember";
import { QueryClient } from "@tanstack/react-query";
import PocketBase from "pocketbase";

import { TypedPocketBase } from "./types";

const API_URL = "https://server.track.aidmedium.com";

export const api = new PocketBase(API_URL) as TypedPocketBase;
api.autoCancellation(false);

export const authQueryKey = ["auth"];

export const queryClient = remember("react-query", () => new QueryClient());
