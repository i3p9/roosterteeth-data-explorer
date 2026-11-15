import { Client } from "pg";

// A module-level pool would share sockets across Worker requests.
export async function queryPostgres(query, values) {
	const client = new Client({
		user: process.env.PG_DB_USER,
		host: process.env.PG_DB_HOST,
		database: process.env.PG_DB_NAME,
		password: process.env.PG_DB_PASSWORD,
		port: process.env.PG_DB_PORT,
		connectionTimeoutMillis: 10000,
	});

	try {
		await client.connect();
		return await client.query(query, values);
	} finally {
		await client.end();
	}
}
