/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
  SENDGRID_API_KEY: string;
  EMAIL_SENDER_ADDRESS: string;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
