import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const [catalog, manifest] = await Promise.all([
	readJson("src/data/master.json"),
	readJson("dist/server/vinext-prerender.json"),
]);

const errors = manifest.routes.filter((route) => route.status === "error");
assert.equal(errors.length, 0, `Prerender errors: ${JSON.stringify(errors)}`);

const rendered = new Set(manifest.routes
	.filter((route) => route.status === "rendered")
	.map((route) => route.path ?? route.route));

for (const show of catalog.data) {
	const path = `/show/${show.attributes.slug}`;
	assert.ok(rendered.has(path), `Missing prerendered show: ${path}`);
}

assert.ok(rendered.has("/"), "Homepage was not prerendered");
assert.ok(!rendered.has("/user/account"), "Account page must stay dynamic");
console.log(`Verified ${catalog.data.length} show snapshots; ${rendered.size} routes rendered without errors.`);
