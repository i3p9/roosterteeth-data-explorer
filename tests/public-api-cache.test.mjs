import assert from "node:assert/strict";
import test from "node:test";
import { fetchPublicApi } from "../src/lib/publicApiCache.js";

function fixture() {
	const entries = new Map();
	const pending = [];
	return {
		entries,
		pending,
		cache: {
			async match(key) { return entries.get(key.url)?.clone(); },
			async put(key, response) { entries.set(key.url, response); },
		},
		waitUntil(promise) { pending.push(promise); },
	};
}

test("repeated public reads reuse the response, with separate query variants", async () => {
	const f = fixture();
	let reads = 0;
	const origin = () => {
		reads++;
		return Response.json({ reads }, { headers: { "Cache-Control": "public, s-maxage=60" } });
	};
	for (const slug of ["first", "first", "second"]) {
		const response = await fetchPublicApi(new Request(`https://example.test/api/v1/episode?slug=${slug}`), f.cache, f.waitUntil, origin);
		assert.equal(response.status, 200);
		await Promise.all(f.pending);
	}
	assert.equal(reads, 2);
	assert.equal(f.entries.size, 2);
});

test("credentials, mutations, private routes, and reloads bypass the shared cache", async () => {
	for (const [path, options] of [
		["episode", { headers: { Cookie: "session=private" } }],
		["episode", { headers: { Authorization: "Bearer private" } }],
		["episode", { headers: { Origin: "https://dev.rtarchive.xyz" } }],
		["episode", { method: "POST" }],
		["like", {}], ["liked-videos", {}], ["new-comments", {}], ["search", {}],
		["episode", { headers: { "Cache-Control": "no-cache" } }],
	]) {
		const f = fixture();
		await fetchPublicApi(new Request(`https://example.test/api/v1/${path}`, options), f.cache, f.waitUntil,
			() => Response.json({}, { headers: { "Cache-Control": "public, s-maxage=60" } }));
		await Promise.all(f.pending);
		assert.equal(f.entries.size, 0, path);
	}
});

test("errors, private responses, and session-setting responses cannot be cached", async () => {
	for (const options of [
		{ status: 400, headers: { "Cache-Control": "public, s-maxage=60" } },
		{ headers: { "Cache-Control": "private, no-store" } },
		{ headers: { "Cache-Control": "public, s-maxage=60", "Set-Cookie": "session=private" } },
		{ headers: { "Cache-Control": "public, s-maxage=60", Vary: "*" } },
	]) {
		const f = fixture();
		await fetchPublicApi(new Request("https://example.test/api/v1/episode"), f.cache, f.waitUntil, () => Response.json({}, options));
		await Promise.all(f.pending);
		assert.equal(f.entries.size, 0);
	}
});
