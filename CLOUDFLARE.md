# Cloudflare migration with vinext

This branch prepares RTArchive for Cloudflare Workers using vinext. No Worker,
Cloudflare resource, domain, or DNS record has been created or changed.

## Local use

Use Node 24 and the package manager pinned in `package.json`:

```sh
pnpm install --frozen-lockfile
pnpm check:vinext
pnpm dev:vinext
```

Keep the existing credentials in `.env.local`. `.env.example` lists the required
names without credentials. The local Worker loads these values from `.env.local`.

To test the production Worker locally, run these in separate terminals:

```sh
pnpm build:vinext
pnpm start:vinext --host 127.0.0.1 --port 4173
```

```sh
pnpm test:cache
pnpm test:cloudflare
```

The smoke test uses installed Chrome on macOS. Elsewhere, install Chromium with
`pnpm exec playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.
Pass a different origin as `pnpm test:cloudflare http://127.0.0.1:4173`.
Screenshots are written to `/tmp/rt-cloudflare-smoke` by default.

The original `dev`, `build`, and `start` scripts still run Next.js. Next.js was
updated to 15.5.29 so it can share React 19.3.1 with vinext. Headless UI, Motion,
next-themes, and the Postgres driver were updated for this runtime.
The roulette dependency still declares a React 18 peer requirement; its complete
spin and result-popup flow passed browser testing with the pinned React 19 version.

## Serving and caching

- All 423 catalog show pages are built with their initial season's episodes.
  The Static Assets adapter serves their HTML and navigation payloads until the
  next deployment. `build:vinext` fails if any show snapshot is missing or any
  prerender reports an error.
- Public files and generated browser assets bypass the Worker. The private
  `/_vinext/static-cache/` directory goes through vinext and cannot be fetched
  directly. This keeps public file requests out of compute usage.
- Anonymous episode, season, and recommendation GET responses with an explicit
  public cache policy use Cloudflare's Cache API. Cache hits include
  `Cache-Status: rtarchive; hit`. Cookie-bearing requests, authorization headers,
  CORS requests, reloads, account data, mutations, and errors bypass this cache.
  Its entries are local to a Cloudflare data center. Existing public API cache
  lifetimes are preserved; use a cache purge when changing those records.
- MongoDB and Postgres remain at their current providers. No data was migrated.
  `DATABASE_CONNECTION_MODE` is set to `request` in the Worker configuration:
  MongoDB connections close after each operation, while Node builds reuse a
  pool. Postgres queries also close their connections. Keep this binding when
  deploying to Workers.
- The image CDN already provides appropriately sized files, so Cloudflare Images
  is unnecessary for this setup. Unused Google font loads and Vercel Analytics
  were removed. Google Analytics remains enabled through `next/script`.

The pinned `tr46` patch makes MongoDB's CommonJS URL parser load `punycode` through
the supported Node module path in Workers. Keep the patch and lockfile together.
The compatibility scanner reports partial support for image optimization and
App Router development Strict Mode. Images are deliberately unoptimized; vinext
does not currently apply the `reactStrictMode` setting to App Router development.

## Deployment preparation

The source configuration is `cloudflare.config.ts`, with Worker name `rtarchive`.
The native integration currently uses pinned beta versions of Cloudflare's Vite
plugin and `cf` CLI. Review the name and account before the first deployment.

1. Set the three `NEXT_PUBLIC_*` values in the build environment. They are public
   and are embedded at build time. Set `NEXT_PUBLIC_BASE_URL` to the actual origin
   being tested or deployed. MongoDB credentials are also needed during builds.
2. Configure the nine runtime secrets declared in `cloudflare.config.ts` on the
   selected Worker: MongoDB, the five Postgres settings, and the three Pinecone
   settings. Do not put secret values into source config or commit `.env.local`.
3. Authenticate the `cf` CLI and select the intended Cloudflare account. Follow
   the current [vinext deployment instructions](https://vinext.dev/docs/deploying/cloudflare).
4. Deploy a separate preview and verify real Supabase login, logout, session
   refresh, likes, and comments there. Add its exact callback origin to Supabase's
   redirect allowlist before testing login. Local tests cover anonymous redirects
   and login forms; they do not create sessions or write user data.
5. When ready for production, `pnpm deploy:vinext` builds, validates the catalog,
   then deploys that output. Change DNS only after the preview checks pass.

For Workers Builds, leave the build command empty and set the deploy command to
`pnpm run deploy:vinext`. The command already builds and checks the snapshots.
Use the preview command documented by vinext for pull requests.

Cloudflare's [static asset pricing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
and [Worker pricing](https://developers.cloudflare.com/workers/platform/pricing/)
are separate. Serving a snapshot or hitting the API cache still invokes a Worker;
only direct public asset requests bypass it. Validate compute usage on the preview
before choosing a plan. The Vercel screenshot combines all projects and cannot
establish the cause of the October 29 request spike.
