import { MongoClient } from "mongodb";

let nodeClientPromise;

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
	let client;
	if (requestScoped) {
		client = createClient();
	} else {
		// Node builds and the Next.js server can safely reuse a pool.
		nodeClientPromise ??= createClient().connect().catch((error) => {
			nodeClientPromise = undefined;
			throw error;
		});
		client = await nodeClientPromise;
	}

	try {
		if (requestScoped) await client.connect();
		return await operation(client.db("roosterteeth_site"));
	} finally {
		if (requestScoped) await client.close();
	}
}
