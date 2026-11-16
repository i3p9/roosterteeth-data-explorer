import { MongoClient } from "mongodb";

let nodePool;

function acquireNodePool() {
	if (!nodePool) {
		const pool = { users: 0, idleTimer: undefined };
		pool.promise = createClient().connect().catch((error) => {
			if (nodePool === pool) nodePool = undefined;
			throw error;
		});
		nodePool = pool;
	}

	clearTimeout(nodePool.idleTimer);
	nodePool.users += 1;
	return nodePool;
}

function releaseNodePool(pool, prerendering) {
	pool.users -= 1;
	if (!prerendering || pool.users !== 0) return;

	// Reuse the pool across page renders, then release its sockets so the build
	// can exit. A new operation cancels this timer before borrowing the pool.
	pool.idleTimer = setTimeout(() => {
		if (pool.users !== 0) return;
		if (nodePool === pool) nodePool = undefined;
		pool.promise.then((client) => client.close()).catch((error) => {
			console.error("Could not close the prerender database pool:", error);
		});
	}, 1000);
	pool.idleTimer.unref();
}

function createClient() {
	return new MongoClient(process.env.MONGODB_URI, {
		maxPoolSize: 10,
		minPoolSize: 0,
		serverSelectionTimeoutMS: 5000,
		connectTimeoutMS: 10000,
	});
}

// Workers use request-scoped connections; Node builds and servers reuse a pool.
export async function withDatabase(operation) {
	if (!process.env.MONGODB_URI) {
		throw new Error('Missing environment variable: "MONGODB_URI"');
	}

	const requestScoped = process.env.DATABASE_CONNECTION_MODE === "request";
	const prerendering = process.env.VINEXT_PRERENDER === "1";
	let client;
	let pool;
	if (requestScoped) {
		client = createClient();
	} else {
		// Node builds and the Next.js server can safely reuse a pool.
		pool = acquireNodePool();
	}

	try {
		if (requestScoped) await client.connect();
		else client = await pool.promise;
		return await operation(client.db("roosterteeth_site"));
	} finally {
		if (requestScoped) await client.close();
		else releaseNodePool(pool, prerendering);
	}
}
