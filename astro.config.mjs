import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

import db from "@astrojs/db";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "cloudflare",
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [db()],
});
