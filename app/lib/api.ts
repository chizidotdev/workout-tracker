import PocketBase from "pocketbase";

import { TypedPocketBase } from "./types";

const API_URL = "https://server.track.aidmedium.com";

export const api = new PocketBase(API_URL) as TypedPocketBase;
