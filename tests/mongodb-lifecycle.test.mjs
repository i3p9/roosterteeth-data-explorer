import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { loadEnv } from "vite";

const execFileAsync = promisify(execFile);
const env = { ...process.env, ...loadEnv("test", process.cwd(), "") };
const moduleUrl = pathToFileURL(path.resolve("src/lib/mongodb.js")).href;

async function runDatabaseProcess(mode, operation) {
	const { stdout } = await execFileAsync(process.execPath, ["--input-type=module", "-e", `
		import { withDatabase } from ${JSON.stringify(moduleUrl)};
		${operation}
		console.log("database operations completed");
	`], {
		env: { ...env, DATABASE_CONNECTION_MODE: mode, VINEXT_PRERENDER: "1" },
		timeout: 15000,
	});
	assert.match(stdout, /database operations completed/);
}

test("a prerender database operation exits without leaving sockets open", { skip: !env.MONGODB_URI }, async () => {
	await runDatabaseProcess("", `await withDatabase(db => db.command({ ping: 1 }));`);
});

test("prerender cleanup waits for overlapping operations to finish", { skip: !env.MONGODB_URI }, async () => {
	await runDatabaseProcess("", `await Promise.all([
		withDatabase(db => db.command({ ping: 1 })),
		withDatabase(async db => {
			await new Promise(resolve => setTimeout(resolve, 1500));
			return db.command({ ping: 1 });
		}),
	]);`);
});

test("Worker request-scoped database operations close their connections", { skip: !env.MONGODB_URI }, async () => {
	await runDatabaseProcess("request", `
		await withDatabase(db => db.command({ ping: 1 }));
		await withDatabase(db => db.command({ ping: 1 }));
	`);
});
