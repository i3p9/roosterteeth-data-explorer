import application from "vinext/server/fetch-handler";
import { fetchPublicApi } from "./src/lib/publicApiCache.js";

export * from "vinext/server/fetch-handler";

export default {
	fetch(request, env, ctx) {
		return fetchPublicApi(
			request,
			globalThis.caches?.default,
			(promise) => ctx.waitUntil(promise),
			() => application.fetch(request, env, ctx),
		);
	},
};
