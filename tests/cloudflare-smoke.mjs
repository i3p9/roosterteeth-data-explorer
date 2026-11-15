import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.argv[2] ?? process.env.TEST_BASE_URL ?? "http://127.0.0.1:4173";
const artifacts = process.env.TEST_ARTIFACT_DIR ?? "/tmp/rt-cloudflare-smoke";
const episodeSlug = "f-kface-season-6-ff202";
const emptyUser = "00000000-0000-0000-0000-000000000000";
const results = [];
await mkdir(artifacts, { recursive: true });

async function getJson(path, options) {
	const response = await fetch(`${base}${path}`, options);
	assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
	return response.json();
}

const { documents: [episode] } = await getJson(`/api/v1/episode?slug=${episodeSlug}`);
assert.equal(episode.attributes.slug, episodeSlug);
for (let round = 0; round < 2; round++) {
	await Promise.all(Array.from({ length: 3 }, async () => {
		const { documents } = await getJson(`/api/v1/episode/${episode.uuid}`, { headers: { "Cache-Control": "no-cache" } });
		assert.equal(documents[0].uuid, episode.uuid);
		const { comments } = await getJson(`/api/v1/comments?video_id=${episode.uuid}&limit=1`);
		assert.ok(Array.isArray(comments));
	}));
}
results.push("MongoDB and Postgres: sequential and concurrent requests");

let hit = false;
for (let attempt = 0; attempt < 3; attempt++) {
	const response = await fetch(`${base}/api/v1/episode?slug=${episodeSlug}`);
	await response.arrayBuffer();
	if (response.headers.get("cache-status")?.includes("rtarchive; hit")) hit = true;
}
assert.ok(hit, "Repeated anonymous archive reads should hit the Worker cache");
results.push("Public API responses hit the Worker cache");

for (const path of [
	`/api/v1/liked-videos?userId=${emptyUser}`,
	`/api/v1/like?user_id=${emptyUser}&video_id=${episode.uuid}`,
	`/api/v1/new-comments?videoId=${episode.uuid}&limit=1`,
]) {
	const response = await fetch(`${base}${path}`);
	assert.equal(response.status, 200, path);
	assert.doesNotMatch(response.headers.get("cache-control") ?? "", /public|s-maxage/i);
}
assert.equal((await fetch(`${base}/api/v1/episode`)).status, 400);
assert.equal((await fetch(`${base}/api/v1/new-comments`, { method: "POST", body: "{}" })).status, 401);
const callback = await fetch(`${base}/auth/callback`, { redirect: "manual" });
assert.equal(callback.status, 307);
const account = await fetch(`${base}/user/account`, { redirect: "manual" });
assert.equal(account.status, 307);
assert.match(account.headers.get("location"), /\/login/);
results.push("API validation, private cache policies, anonymous login redirects");

const seasons = JSON.parse(await readFile("public/shows_by_slug/rt-podcast/seasons_data_rt-podcast.json", "utf8")).data;
const initial = await getJson(`/api/v1/episodes?season_id=${seasons[0].uuid}`);
const chrome = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: existsSync(chrome) ? chrome : undefined, headless: true });

try {
	const noJs = await browser.newContext({ javaScriptEnabled: false });
	const noJsPage = await noJs.newPage();
	assert.equal((await noJsPage.goto(`${base}/show/rt-podcast`)).status(), 200);
	assert.equal(await noJsPage.locator('a[href^="/watch/"] h1').count(), initial.documents.length);
	await noJs.close();
	results.push("Initial episode list works without JavaScript");

	for (const mobile of [false, true]) {
		const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
		await context.route("https://www.googletagmanager.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
		const page = await context.newPage();
		const errors = [];
		page.on("pageerror", (error) => errors.push(error.message));
		const catalogCalls = [];
		page.on("request", (request) => {
			if (new URL(request.url()).pathname === "/api/v1/episodes") catalogCalls.push(request.url());
		});
		await page.goto(base);
		const showLink = page.locator('a[href="/show/rt-podcast"]');
		await showLink.scrollIntoViewIfNeeded();
		await showLink.hover();
		await showLink.click();
		await page.waitForURL(`${base}/show/rt-podcast`);
		const cards = page.locator('a[href^="/watch/"] h1');
		await cards.first().waitFor();
		assert.equal(await cards.count(), initial.documents.length);
		assert.equal(catalogCalls.length, 0, "Initial episodes should come from the prerender");
		await page.getByRole("button", { name: /^Season \d+$/ }).click();
		await page.getByRole("option", { name: new RegExp(`^Season ${seasons[1].attributes.number}\\b`) }).click();
		await page.waitForFunction((title) => [...document.querySelectorAll("button")].some((button) => button.textContent.trim() === title), `Season ${seasons[1].attributes.number}`);
		await page.getByRole("button", { name: "Download", exact: true }).waitFor({ state: "visible" });
		await page.waitForFunction(() => !document.querySelector('button[disabled]') && document.querySelectorAll('a[href^="/watch/"] h1').length > 0);
		await page.getByPlaceholder("Filter...").fill("podcast");
		await page.getByPlaceholder("Filter...").fill("");
		await page.getByRole("button", { name: "Download", exact: true }).click();
		await page.getByRole("menuitem").first().waitFor();
		await page.keyboard.press("Escape");
		await page.screenshot({ path: `${artifacts}/${mobile ? "mobile" : "desktop"}.png`, fullPage: false });
		const watchHref = await page.locator('a[href^="/watch/"]').first().getAttribute("href");
		await page.goto(new URL(watchHref, base).href);
		await page.locator("video").first().waitFor();
		await page.goto(`${base}/login`);
		await page.getByRole("button", { name: /Google/i }).waitFor();
		assert.deepEqual(errors, [], `${mobile ? "Mobile" : "Desktop"} browser errors`);
		await context.close();
		results.push(`${mobile ? "Mobile" : "Desktop"}: navigation, hydration, seasons, filter, downloads, watch player, login form`);
	}

	const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
	await context.route("https://www.googletagmanager.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
	await context.route("https://roosterteeth.fhm.workers.dev/random*", (route) => route.fulfill({ json: { documents: Array.from({ length: 10 }, () => episode) } }));
	const page = await context.newPage();
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await page.goto(`${base}/random`);
	await page.getByRole("button", { name: "SPIN", exact: true }).click();
	await page.getByRole("link", { name: "WATCH NOW", exact: true }).waitFor({ timeout: 30000 });
	assert.deepEqual(errors, [], "Random wheel browser errors");
	assert.equal((await page.goto(`${base}/show/not-a-real-show`)).status(), 404);
	assert.equal((await context.request.get(`${base}/_vinext/static-cache/manifest.json`)).status(), 404);
	await context.close();
	results.push("Random wheel spin and popup, unknown-show 404, private snapshot path protection");
} finally {
	await browser.close();
}

console.log(JSON.stringify({ base, passed: results, screenshots: artifacts }, null, 2));
