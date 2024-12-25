import { hc } from "hono/client";

import type { TApp } from "@/app/api/[[...route]]/route";
import { APP_URL } from "@/core/configs";

export const client = hc<TApp>(APP_URL);
