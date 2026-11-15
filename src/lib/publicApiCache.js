const archiveRead = /^\/api\/v1\/(?:episode(?:\/[^/]+)?|episodes|season|show|recommendation)$/;

// Cache only anonymous archive reads. Account data, mutations, and error
// responses always reach the application and never enter the shared cache.
export async function fetchPublicApi(request, cache, waitUntil, fetchResponse) {
	const eligible = cache && request.method === "GET"
		&& archiveRead.test(new URL(request.url).pathname)
		&& !request.headers.has("authorization")
		&& !request.headers.has("cookie")
		&& !request.headers.has("origin")
		&& !/no-cache|no-store|max-age=0/i.test(request.headers.get("cache-control") ?? "");
	if (!eligible) return fetchResponse();

	const key = new Request(request.url);
	let cached;
	try {
		cached = await cache.match(key);
	} catch (error) {
		console.error("Archive cache lookup failed:", error);
	}
	if (cached) {
		const response = new Response(cached.body, cached);
		response.headers.set("Cache-Status", "rtarchive; hit");
		return response;
	}

	const response = await fetchResponse();
	const policy = response.headers.get("cache-control") ?? "";
	if (response.ok && /\bpublic\b/i.test(policy)
		&& !/private|no-store/i.test(policy)
		&& !response.headers.has("set-cookie")
		&& response.headers.get("vary") !== "*") {
		waitUntil(cache.put(key, response.clone()).catch((error) => {
			console.error("Archive response could not be cached:", error);
		}));
	}
	return response;
}
