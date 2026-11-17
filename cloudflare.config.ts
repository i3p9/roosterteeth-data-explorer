import { bindings, defineConfig, defineWorker } from "cf/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode ?? "production", import.meta.dirname, "NEXT_PUBLIC_");
  function publicValue(name: string) {
    const value = env[name];
    if (!value?.trim()) {
      throw new Error(`Missing public build variable: ${name}. See CLOUDFLARE.md.`);
    }
    return bindings.text(value);
  }

  return {
    worker: defineWorker({
      name: "roosterteeth-data-explorer",
      entrypoint: "./cloudflare.worker.js",
      compatibilityDate: "2026-11-15",
      previewUrls: false,
      domains: ["rtarchive.xyz"],
      assets: {
        htmlHandling: "none",
        notFoundHandling: "none",
        // Public assets bypass compute; private prerender files must go through vinext.
        runWorkerFirst: ["/_vinext/static-cache/*"],
      },
      env: {
        ASSETS: bindings.assets(),
        DATABASE_CONNECTION_MODE: bindings.text("request"),
        // Keep the runtime values in sync with the browser build. Use an explicit
        // allowlist so unrelated NEXT_PUBLIC_ values cannot become bindings.
        NEXT_PUBLIC_BASE_URL: publicValue("NEXT_PUBLIC_BASE_URL"),
        NEXT_PUBLIC_SUPABASE_URL: publicValue("NEXT_PUBLIC_SUPABASE_URL"),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: publicValue("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
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
  };
});
