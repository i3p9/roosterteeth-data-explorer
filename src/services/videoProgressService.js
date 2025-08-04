const DB_NAME = "videoProgressDB";
const STORE_NAME = "videoProgress";
const DB_VERSION = 1;

class VideoProgressService {
	async initDB() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result);

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					const store = db.createObjectStore(STORE_NAME, {
						keyPath: "uuid",
					});
					store.createIndex("lastUpdated", "lastUpdated");
				}
			};
		});
	}

	async saveProgress(uuid, currentTime, duration) {
		const db = await this.initDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([STORE_NAME], "readwrite");
			const store = transaction.objectStore(STORE_NAME);

			const progress = {
				uuid,
				currentTime,
				duration,
				lastUpdated: Date.now(),
				watchedPercentage: (currentTime / duration) * 100 || 0,
			};

			const request = store.put(progress);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	async getProgress(uuid) {
		const db = await this.initDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([STORE_NAME], "readonly");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.get(uuid);

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	async getData(limit = 10, offset = 0) {
		const db = await this.initDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([STORE_NAME], "readonly");
			const store = transaction.objectStore(STORE_NAME);
			const index = store.index("lastUpdated");

			// Use openCursor to get sorted results
			const request = index.openCursor(null, "prev");
			const results = [];
			let skipped = 0;

			request.onsuccess = (event) => {
				const cursor = event.target.result;
				if (cursor) {
					if (skipped < offset) {
						// Skip entries until we reach the offset
						skipped++;
						cursor.continue();
					} else if (results.length < limit) {
						// Add entries until we reach the limit
						results.push(cursor.value);
						cursor.continue();
					} else {
						// We've reached our limit
						resolve(results);
					}
				} else {
					// No more entries
					resolve(results);
				}
			};
			request.onerror = () => reject(request.error);
		});
	}

	async cleanupOldEntries(maxEntries = 500) {
		const db = await this.initDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([STORE_NAME], "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const index = store.index("lastUpdated");

			// Get total count
			const countRequest = store.count();
			countRequest.onsuccess = () => {
				if (countRequest.result > maxEntries) {
					const numToDelete = countRequest.result - maxEntries;

					// Get oldest entries
					const request = index.openCursor();
					let deleted = 0;

					request.onsuccess = (event) => {
						const cursor = event.target.result;
						if (cursor && deleted < numToDelete) {
							store.delete(cursor.primaryKey);
							deleted++;
							cursor.continue();
						}
					};
				}
			};

			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(transaction.error);
		});
	}
}

export const videoProgressService = new VideoProgressService();
