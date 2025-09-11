import { treaty } from "@elysiajs/eden";
import type { App } from "@/app/api/[[...slugs]]/route";

export const client = treaty<App>(
  (process.env.APP_URL as string) ?? "localhost:3000"
);
