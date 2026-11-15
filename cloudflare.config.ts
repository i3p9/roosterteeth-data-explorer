import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "rtarchive",
    entrypoint: "./cloudflare.worker.js",
    compatibilityDate: "2026-11-14",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      // Public assets bypass compute; private prerender files must go through vinext.
      runWorkerFirst: ["/_vinext/static-cache/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      DATABASE_CONNECTION_MODE: bindings.text("request"),
      MONGODB_URI: bindings.secret(),
      PG_DB_USER: bindings.secret(),
      PG_DB_HOST: bindings.secret(),
      PG_DB_NAME: bindings.secret(),
      PG_DB_PASSWORD: bindings.secret(),
      PG_DB_PORT: bindings.secret(),
      PINECONE_API_KEY: bindings.secret(),
      PINECONE_DB_URL: bindings.secret(),
      PINECONE_DB_TABLE: bindings.secret(),
    },
  }),
});
