# Database Migration Analysis: MongoDB → Cloudflare D1

## Table of Contents
1. [Current Architecture Overview](#1-current-architecture-overview)
2. [Complete API Endpoint Inventory](#2-complete-api-endpoint-inventory)
3. [Data Sources & Scale](#3-data-sources--scale)
4. [MongoDB Document Schemas](#4-mongodb-document-schemas)
5. [Proposed D1 Schema Design](#5-proposed-d1-schema-design)
6. [API Endpoint Migration Map](#6-api-endpoint-migration-map)
7. [Search Strategy (Critical Challenge)](#7-search-strategy-critical-challenge)
8. [Static JSON Files Assessment](#8-static-json-files-assessment)
9. [Migration Plan (Phased)](#9-migration-plan-phased)
10. [Risks & Considerations](#10-risks--considerations)

---

## 1. Current Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App (Vercel)                  │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Homepage    │  │  Watch Page  │  │  Show Page    │  │
│  │  (master.json│  │  (MongoDB)   │  │  (JSON+Mongo) │  │
│  │   + Fuse.js) │  │              │  │               │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                │                   │          │
│  ┌──────┴────────────────┴───────────────────┴───────┐  │
│  │              API Routes (/api/v1/*)                │  │
│  └──┬──────────┬──────────────┬──────────────┬───────┘  │
└─────┼──────────┼──────────────┼──────────────┼──────────┘
      │          │              │              │
      ▼          ▼              ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│ MongoDB  │ │ Postgres │ │ Pinecone │ │ Static JSON  │
│ Atlas    │ │ Supabase │ │ VectorDB │ │ (public/)    │
│          │ │          │ │          │ │              │
│ episodes │ │ comments │ │ vectors  │ │ 423 shows    │
│ shows    │ │ likes    │ │          │ │ 1280 seasons │
│          │ │ search   │ │          │ │ ~132MB       │
│          │ │ history  │ │          │ │              │
└──────────┘ └──────────┘ └──────────┘ └──────────────┘
```

### What's IN scope for migration (Phase 1):
- **MongoDB** `episodes` and `shows` collections → Cloudflare D1
- **Static JSON files** (public/shows/, public/shows_by_slug/) → Could be generated from D1

### What's OUT of scope (keep as-is):
- PostgreSQL/Supabase (comments, likes, search_history) — user-generated, relational, fine as-is
- Pinecone (recommendations) — specialized vector search, fine as-is
- `master.json` (src/data/) — can be regenerated from D1 as a build step later

---

## 2. Complete API Endpoint Inventory

### MongoDB-Dependent Endpoints (MUST MIGRATE)

| Endpoint | File | MongoDB Collection | Query Pattern | Frontend Consumer | Priority |
|----------|------|-------------------|---------------|-------------------|----------|
| `GET /api/v1/episode` | `src/app/api/v1/episode/route.js` | `episodes` | Find by uuid, id, or slug | Watch page, User account, Video progress | **Critical** |
| `GET /api/v1/episode/[uuid]` | `src/app/api/v1/episode/[uuid]/route.js` | `episodes` | Find by comma-separated UUIDs | User account (liked videos) | **Critical** |
| `GET /api/v1/episodes` | `src/app/api/v1/episodes/route.js` | `episodes` | Find by season_id/show_id/season_slug/show_slug, sorted by air date | Show page, Download pages, Season container | **Critical** |
| `GET /api/v1/show` | `src/app/api/v1/show/route.js` | `shows` | Find by show_id (uuid) or show_slug | Show page | **High** |
| `GET /api/v1/season` | `src/app/api/v1/season/route.js` | `episodes` | Find by season_id or season_slug, sorted by air date | Watch page sidebar | **Critical** |
| `GET /api/v1/search` | `src/app/api/v1/search/route.js` | `episodes` (Atlas Search) | Full-text search on title + channel filter | Search page | **High** |
| `GET /api/v1/autocomplete` | `src/app/api/v1/autocomplete/route.js` | `episodes` (Atlas Search) | Autocomplete on title | Search page | **High** |
| `GET /api/v1/random` | `src/app/api/v1/random/route.js` | `episodes` | $match + $sample (10 random) | Random page | **Medium** |

### MongoDB-Dependent (Indirect — via recommendation)

| Endpoint | File | Databases | Notes |
|----------|------|-----------|-------|
| `GET /api/v1/recommendation` | `src/app/api/v1/recommendation/route.js` | Pinecone + MongoDB `episodes` | Fetches IDs from Pinecone, then looks up episodes in MongoDB. Will need to read from D1 instead. |

### PostgreSQL Endpoints (NOT migrating)

| Endpoint | File | Table |
|----------|------|-------|
| `GET /api/v1/comments` | `src/app/api/v1/comments/route.js` | `comments` |
| `GET /api/v1/threads` | `src/app/api/v1/threads/route.js` | `comments` |
| `POST/GET /api/v1/new-comments` | `src/app/api/v1/new-comments/route.js` | `live_comments` |
| `GET /api/v1/liked-videos` | `src/app/api/v1/liked-videos/route.js` | `liked_videos` |
| `GET /api/v1/like` | `src/app/api/v1/like/route.js` | `liked_videos` |

---

## 3. Data Sources & Scale

### MongoDB Collections

| Collection | Est. Documents | Used By | Key Indexes |
|-----------|---------------|---------|-------------|
| `episodes` | ~50,000+ (based on episode IDs like 52804) | 8 API endpoints | uuid, id, attributes.slug, attributes.season_id, attributes.show_id, attributes.season_slug, attributes.show_slug, attributes.channel_id, attributes.original_air_date |
| `shows` | ~423 (matches public/shows count) | 1 API endpoint | uuid, attributes.slug |

### Static JSON Files (public/)

| Directory | Contents | Count | Total Size |
|-----------|----------|-------|------------|
| `public/shows/{uuid}/` | seasons_data + season episode JSONs | 423 shows, 1280 season files | ~66MB |
| `public/shows_by_slug/{slug}/` | Same data, accessed by slug | 423 shows (mirrors above) | ~66MB |

**Note:** The static JSON files contain the SAME data as MongoDB but are structured differently:
- `seasons_data_{uuid}.json` → List of seasons for a show (season metadata)
- `{season_uuid}.json` → Episodes in that season (full episode objects with archive data)

This is essentially a pre-computed/denormalized cache of the MongoDB data, served as static files.

### src/data/master.json (~245KB)
- Contains all ~423 shows with metadata
- Used by homepage for show listing + client-side Fuse.js search
- Used by `getShowIdFromSlug()` and `getShowInfo()` utilities
- Could be auto-generated from D1 as a build step

---

## 4. MongoDB Document Schemas

### `episodes` Collection
```json
{
  "_id": ObjectId,
  "id": 52804,                              // numeric ID (used for archive.org lookups)
  "type": "episode",                        // "episode" or "bonus"
  "uuid": "8413e36c-7d47-44bc-a265-baf6d69f3633",
  "attributes": {
    "title": "The British Jackal // Beard Faucet [202]",
    "slug": "f-kface-season-6-ff202",
    "number": 62,
    "description": "Geoff, Gavin, and Andrew talk about...",
    "length": 3954,                         // seconds
    "original_air_date": "2024-04-10T07:00:00.000Z",
    "channel_id": "75ba87e8-06fd-4482-bad9-52a4da2c6181",
    "channel_slug": "f-kface",
    "channel_title": "F**kFace",
    "season_id": "d849bf60-fea9-4262-b9ed-d8e8c88d5974",
    "season_slug": "f-kface-season-6",
    "season_number": 6,
    "season_title": "Season 6",
    "show_id": "a1e355c7-2d86-4a62-a7ab-240bdae40b04",
    "show_slug": "f-kface",
    "show_title": "F**KFACE",
    "is_sponsors_only": false,
    "member_tier_i": 0,                     // (sometimes present)
    "comments": 44
  },
  "archive": {                              // nullable - not all episodes are archived
    "id": "roosterteeth-52804",
    "status": "archived",                   // (sometimes present)
    "files": [
      {
        "name": "2024-04-10_..._[52804].mp4",
        "filesize": 2010756186,
        "file_ext": "mp4",
        "md5": "..."                        // (sometimes present)
      }
    ],
    "has_subtitle": true
  }
}
```

### `shows` Collection
```json
{
  "_id": ObjectId,
  "id": 379,
  "type": "show",
  "uuid": "86c5ae58-3346-4068-a5f5-6fa0809e973b",
  "attributes": {
    "title": "Red Web",
    "slug": "red-web",
    "is_sponsors_only": false,
    "published_at": "2020-07-01T15:17:16.000Z",
    "summary": "Red Web explores the oddities...",
    "category": "episodic",
    "channel_id": "16d7e2f0-e67a-4bfd-9c27-427e722da888",
    "channel_slug": "red-web",
    "season_count": 6,
    "episode_count": 198,
    "last_episode_golive_at": "2024-04-22T07:00:00.000Z",
    "has_bonus_feature": true,
    "bonus_feature_number": 4
  }
}
```

---

## 5. Proposed D1 Schema Design

### Option A: Flattened Relational (Recommended)

Flatten the nested `attributes` into columns. This is the cleanest approach for D1/SQLite.

```sql
-- ============================================
-- SHOWS TABLE
-- ============================================
CREATE TABLE shows (
    id INTEGER PRIMARY KEY,          -- numeric ID (e.g. 379)
    uuid TEXT NOT NULL UNIQUE,       -- "86c5ae58-..."
    type TEXT NOT NULL DEFAULT 'show',
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    is_sponsors_only INTEGER NOT NULL DEFAULT 0,  -- boolean
    published_at TEXT,               -- ISO 8601
    summary TEXT,
    category TEXT,                   -- "episodic", "podcast", etc.
    channel_id TEXT,
    channel_slug TEXT,
    season_count INTEGER DEFAULT 0,
    episode_count INTEGER DEFAULT 0,
    last_episode_golive_at TEXT,
    has_bonus_feature INTEGER DEFAULT 0,
    bonus_feature_number INTEGER DEFAULT 0
);

CREATE INDEX idx_shows_uuid ON shows(uuid);
CREATE INDEX idx_shows_slug ON shows(slug);
CREATE INDEX idx_shows_channel_id ON shows(channel_id);

-- ============================================
-- EPISODES TABLE
-- ============================================
CREATE TABLE episodes (
    id INTEGER PRIMARY KEY,          -- numeric ID (e.g. 52804)
    uuid TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'episode',  -- "episode" or "bonus"
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    number INTEGER,
    description TEXT,
    length INTEGER,                  -- seconds
    original_air_date TEXT,          -- ISO 8601
    channel_id TEXT,
    channel_slug TEXT,
    channel_title TEXT,
    season_id TEXT,
    season_slug TEXT,
    season_number INTEGER,
    season_title TEXT,
    show_id TEXT,
    show_slug TEXT,
    show_title TEXT,
    is_sponsors_only INTEGER NOT NULL DEFAULT 0,
    member_tier_i INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0
);

CREATE INDEX idx_episodes_uuid ON episodes(uuid);
CREATE INDEX idx_episodes_slug ON episodes(slug);
CREATE INDEX idx_episodes_season_id ON episodes(season_id);
CREATE INDEX idx_episodes_season_slug ON episodes(season_slug);
CREATE INDEX idx_episodes_show_id ON episodes(show_id);
CREATE INDEX idx_episodes_show_slug ON episodes(show_slug);
CREATE INDEX idx_episodes_channel_id ON episodes(channel_id);
CREATE INDEX idx_episodes_channel_slug ON episodes(channel_slug);
CREATE INDEX idx_episodes_air_date ON episodes(original_air_date DESC);

-- Composite indexes for common query patterns
CREATE INDEX idx_episodes_season_id_date ON episodes(season_id, original_air_date DESC);
CREATE INDEX idx_episodes_show_id_date ON episodes(show_id, original_air_date DESC);
CREATE INDEX idx_episodes_season_slug_date ON episodes(season_slug, original_air_date DESC);
CREATE INDEX idx_episodes_show_slug_date ON episodes(show_slug, original_air_date DESC);

-- ============================================
-- ARCHIVE FILES TABLE (normalized from nested array)
-- ============================================
CREATE TABLE episode_archives (
    episode_id INTEGER NOT NULL,
    archive_id TEXT,                  -- "roosterteeth-52804"
    archive_status TEXT,              -- "archived", etc.
    has_subtitle INTEGER DEFAULT 0,
    FOREIGN KEY (episode_id) REFERENCES episodes(id)
);

CREATE INDEX idx_archives_episode_id ON episode_archives(episode_id);

CREATE TABLE archive_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    episode_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    filesize INTEGER,
    file_ext TEXT,
    md5 TEXT,
    FOREIGN KEY (episode_id) REFERENCES episodes(id)
);

CREATE INDEX idx_archive_files_episode_id ON archive_files(episode_id);

-- ============================================
-- SEASONS TABLE (extracted from static JSON)
-- ============================================
CREATE TABLE seasons (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'season',
    title TEXT,
    description TEXT,
    slug TEXT,
    number INTEGER,
    show_id TEXT,
    show_slug TEXT,
    episode_count INTEGER DEFAULT 0,
    published_at TEXT,
    FOREIGN KEY (show_id) REFERENCES shows(uuid)
);

CREATE INDEX idx_seasons_uuid ON seasons(uuid);
CREATE INDEX idx_seasons_slug ON seasons(slug);
CREATE INDEX idx_seasons_show_id ON seasons(show_id);

-- ============================================
-- FTS5 VIRTUAL TABLE (for search/autocomplete)
-- ============================================
CREATE VIRTUAL TABLE episodes_fts USING fts5(
    title,
    description,
    channel_slug,
    show_title,
    content=episodes,
    content_rowid=id
);
```

### Option B: Hybrid with JSON columns

Keep the nested structure using SQLite's JSON support. Simpler migration but slower queries.

```sql
CREATE TABLE episodes (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    attributes TEXT NOT NULL,    -- JSON blob
    archive TEXT                 -- JSON blob (nullable)
);
```

**Recommendation: Option A (Flattened)**
- D1 queries will be much faster with proper columns + indexes
- FTS5 works naturally with real columns
- The data is read-heavy and write-rarely (archive data doesn't change)
- Slightly more work to migrate but much better long-term

---

## 6. API Endpoint Migration Map

### `/api/v1/episode` → D1

**Current (MongoDB):**
```javascript
db.collection("episodes").find({ uuid: { $in: uuidArray } })
db.collection("episodes").find({ id: numericValue })
db.collection("episodes").find({ "attributes.slug": slug })
```

**New (D1):**
```sql
SELECT e.*, ea.archive_id, ea.archive_status, ea.has_subtitle
FROM episodes e
LEFT JOIN episode_archives ea ON e.id = ea.episode_id
WHERE e.uuid IN (?, ?, ?)

-- or by id:
WHERE e.id = ?

-- or by slug:
WHERE e.slug = ?
```

**Response reshaping needed:** The API currently returns documents in MongoDB format with nested `attributes`. The frontend expects this shape. Two options:
1. Reshape in the API route (recommended for backwards compatibility)
2. Update all frontend consumers (more work, cleaner long-term)

---

### `/api/v1/episodes` → D1

**Current:**
```javascript
db.collection("episodes").find({ "attributes.season_id": season_id })
  .sort({ "attributes.original_air_date": -1 })
```

**New:**
```sql
SELECT e.*, ea.archive_id, ea.archive_status, ea.has_subtitle
FROM episodes e
LEFT JOIN episode_archives ea ON e.id = ea.episode_id
WHERE e.season_id = ?
ORDER BY e.original_air_date DESC
```

---

### `/api/v1/show` → D1

**Current:**
```javascript
db.collection("shows").find({ uuid: show_id })
db.collection("shows").find({ "attributes.slug": show_slug })
```

**New:**
```sql
SELECT * FROM shows WHERE uuid = ?
-- or
SELECT * FROM shows WHERE slug = ?
```

---

### `/api/v1/season` → D1

Same as `/api/v1/episodes` but filters by season_id or season_slug.

---

### `/api/v1/search` → D1 FTS5

**Current (MongoDB Atlas Search):**
```javascript
$search: {
    index: "default",
    compound: {
        must: [{ text: { query: query, path: "attributes.title" } }],
        filter: [{ text: { query: channelKey, path: "attributes.channel_slug" } }]
    }
}
```

**New (D1 FTS5):**
```sql
SELECT e.*, ea.archive_id, ea.archive_status, ea.has_subtitle
FROM episodes e
JOIN episodes_fts ON episodes_fts.rowid = e.id
LEFT JOIN episode_archives ea ON e.id = ea.episode_id
WHERE episodes_fts MATCH ?
AND (? = 'all' OR e.channel_slug = ?)
LIMIT ?
```

---

### `/api/v1/autocomplete` → D1 FTS5

**Current (MongoDB Atlas Search autocomplete):**
```javascript
$search: {
    index: "title",
    autocomplete: { query: query, path: "attributes.title" }
}
```

**New (D1 FTS5 with prefix search):**
```sql
SELECT DISTINCT title FROM episodes_fts
WHERE episodes_fts MATCH ? || '*'
LIMIT ?
```

Note: FTS5 prefix search (`term*`) provides autocomplete-like behavior. It won't be as polished as Atlas Search's autocomplete (which handles fuzzy matching, tokenization), but should be adequate for this use case.

---

### `/api/v1/random` → D1

**Current:**
```javascript
[{ $match: { "attributes.channel_id": channel_id } }, { $sample: { size: 10 } }]
```

**New:**
```sql
SELECT e.*, ea.archive_id, ea.archive_status, ea.has_subtitle
FROM episodes e
LEFT JOIN episode_archives ea ON e.id = ea.episode_id
WHERE e.channel_id = ?
ORDER BY RANDOM()
LIMIT 10
```

---

### `/api/v1/recommendation` → D1 (partial)

Only the MongoDB lookup part changes. Pinecone query stays the same.

**Current:**
```javascript
const similarIds = queryResponse.matches.map((item) => item.id);
db.collection("episodes").find({ uuid: { $in: similarIds } })
```

**New:**
```sql
SELECT e.*, ea.archive_id, ea.archive_status, ea.has_subtitle
FROM episodes e
LEFT JOIN episode_archives ea ON e.id = ea.episode_id
WHERE e.uuid IN (?, ?, ?, ...)
```

---

## 7. Search Strategy (Critical Challenge)

MongoDB Atlas Search is the most complex feature to replace. Here are the options:

### Option 1: D1 FTS5 (Recommended for your scale)

SQLite's FTS5 full-text search engine is built into D1.

**Pros:**
- No additional service needed
- Zero additional cost
- Co-located with data (fast)
- Supports prefix queries for autocomplete

**Cons:**
- No fuzzy matching (typo tolerance)
- Less sophisticated ranking than Atlas Search
- No built-in autocomplete — but prefix matching works

**Verdict:** Given that your search is title-based and relatively simple (text + channel filter), FTS5 should be sufficient. Users searching for "red web" or "f**kface" will get exact matches. For ~50K episodes, FTS5 will be very fast.

### Option 2: Cloudflare Workers AI + Vectorize

Use Cloudflare's AI embeddings for semantic search.

**Pros:** Semantic understanding, typo tolerance
**Cons:** More complex, additional cost, might be overkill

### Option 3: External search service (Algolia, Meilisearch)

**Pros:** Best search quality
**Cons:** Additional cost, another service to manage

**Recommendation:** Start with FTS5. If search quality isn't good enough, add Meilisearch Cloud or Algolia later. The current Atlas Search usage is fairly basic (exact text match on title with optional channel filter).

---

## 8. Static JSON Files Assessment

### Current State
- **423 shows** in `public/shows/` (by UUID) and `public/shows_by_slug/` (by slug)
- Each show has a `seasons_data_{id}.json` (season list) + per-season episode JSONs
- Total: ~132MB across both directories
- Data is static (archive data, not actively changing)

### How They're Used

| Consumer | File Pattern | What It Gets |
|----------|-------------|--------------|
| `ShowPageClientSide.js` | `/shows_by_slug/{slug}/seasons_data_{slug}.json` | List of seasons for a show |
| `download/[show_slug]/page.js` | `/shows/{uuid}/seasons_data_{uuid}.json` | Season list for download page |
| `utils.js` (getArchivedLinksByShowId, etc.) | `/shows/{uuid}/seasons/{seasonId}.json` | Episode list with archive data |

### Migration Options

**Option A: Keep static JSON files as-is (Recommended for Phase 1)**
- They work fine, are fast (served by Vercel CDN), and cost nothing
- The data doesn't change frequently
- Lower risk — focus migration effort on the API endpoints

**Option B: Replace with D1 API endpoints**
- Create new endpoints like `/api/v1/show/{slug}/seasons` and `/api/v1/seasons/{uuid}/episodes`
- Generate `seasons` data from the new D1 `seasons` table
- Eliminates the need for ~132MB of static files in the repo

**Option C: Generate static files from D1 at build time**
- Write a build script that queries D1 and generates the JSON files
- Best of both worlds — fast static serving + single source of truth

**Recommendation:** Option A for Phase 1, then Option B or C in Phase 2.

---

## 9. Migration Plan (Phased)

### Phase 0: Preparation (Before any code changes)

1. **Export MongoDB data**
   - Write a script to export all `episodes` and `shows` from MongoDB
   - Export as JSON (one file per collection)
   - Store in a migration directory

2. **Extract seasons data**
   - Parse the static JSON files to extract a complete list of seasons
   - Or derive from episode data (unique season_id/season_slug combinations)

3. **Create D1 database**
   ```bash
   npx wrangler d1 create rtarchive-db
   ```

4. **Set up Wrangler config**
   - Add D1 binding to `wrangler.toml` (if using Workers)
   - Or use D1 HTTP API from Next.js on Vercel

### Phase 1: D1 Setup & Data Migration

1. **Create D1 tables** using the schema from Section 5
2. **Write migration script:**
   - Read exported MongoDB JSON
   - Transform nested `attributes` into flat columns
   - Extract `archive` data into separate tables
   - Insert into D1 via Wrangler or HTTP API
3. **Populate FTS5 index** from episodes data
4. **Extract and insert seasons** from static JSON files into `seasons` table
5. **Validate data** — count checks, spot-check records

### Phase 2: Create D1 Data Access Layer

1. **Create `src/lib/d1.js`** — D1 client initialization
   - If staying on Vercel: Use D1 HTTP API with API token
   - If moving to CF Workers/Pages: Use D1 binding directly

2. **Create helper functions:**
   - `getEpisodeByUuid(uuid)`
   - `getEpisodesBySeasonId(seasonId)`
   - `getEpisodesByShowId(showId)`
   - `getShowByUuid(uuid)`
   - `getShowBySlug(slug)`
   - `searchEpisodes(query, channelSlug, limit)`
   - `autocompleteEpisodes(query, limit)`
   - `getRandomEpisodes(channelId, count)`

3. **Shape responses to match existing MongoDB format**
   - The frontend expects `{ documents: [...] }` with nested `attributes`
   - Create a `reshapeEpisode(row)` function that converts flat D1 rows back to the nested format
   - This allows zero changes to frontend code initially

### Phase 3: Migrate API Endpoints (One at a time)

Migrate in this order based on priority and risk:

| Order | Endpoint | Risk | Notes |
|-------|----------|------|-------|
| 1 | `/api/v1/show` | Low | Simple query, easy to validate |
| 2 | `/api/v1/random` | Low | Simple, result is random anyway |
| 3 | `/api/v1/episode` | Medium | Critical path, needs careful testing |
| 4 | `/api/v1/episode/[uuid]` | Medium | Batch UUID lookup |
| 5 | `/api/v1/episodes` | Medium | Used by multiple pages |
| 6 | `/api/v1/season` | Medium | Critical for watch page sidebar |
| 7 | `/api/v1/search` | High | FTS5 behavior differs from Atlas Search |
| 8 | `/api/v1/autocomplete` | High | FTS5 prefix search differs from Atlas autocomplete |
| 9 | `/api/v1/recommendation` | Low | Just change the episode lookup part |

**Strategy for each endpoint:**
1. Add feature flag (env var) to switch between MongoDB and D1
2. Implement D1 version alongside MongoDB version
3. Test D1 version with feature flag
4. Switch to D1, monitor
5. Remove MongoDB code once stable

### Phase 4: Cleanup

1. Remove MongoDB dependency (`mongodb` package)
2. Remove `src/lib/mongodb.js`
3. Remove MongoDB connection env vars
4. Update `master.json` generation (optional: build from D1)
5. Consider removing static JSON files (optional: serve from D1)

---

## 10. Risks & Considerations

### D1 Limitations to Be Aware Of

| Limitation | Impact | Mitigation |
|-----------|--------|------------|
| **D1 is SQLite** — no native JSON operators as powerful as MongoDB | Need to flatten documents | Schema design in Section 5 handles this |
| **D1 max database size: 10GB (free), 10GB (paid)** | Need to verify data fits | ~50K episodes with archive file data should be well under 1GB |
| **D1 max rows per query: 5MB result** | Large result sets could hit this | Already paginating in most endpoints |
| **D1 read replication** | Reads are global, writes are in one region | Fine — data is mostly read-only |
| **FTS5 limitations** | No fuzzy matching, no scoring sophistication | Acceptable for title-based search |

### Hosting Consideration: Vercel + D1

The app is currently on **Vercel**. Cloudflare D1 is natively available in CF Workers/Pages.

**Options to access D1 from Vercel:**

1. **D1 HTTP API** — Cloudflare provides a REST API for D1
   - Endpoint: `https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/query`
   - Adds some latency vs native binding
   - Works from any platform

2. **Move to Cloudflare Pages** — Deploy the Next.js app on CF Pages
   - Native D1 binding (fastest)
   - CF Pages supports Next.js via `@cloudflare/next-on-pages`
   - Bigger migration but best performance

3. **Hybrid: CF Worker as API gateway** — Put a Worker in front of D1, call it from Vercel
   - Worker handles D1 queries
   - Vercel app calls the Worker API
   - More infrastructure but clean separation

**Recommendation:** Start with Option 1 (D1 HTTP API from Vercel). If latency is an issue, consider moving to Cloudflare Pages later.

### Data Sync During Migration

Since the data is archival (Rooster Teeth content that's not actively being produced), there's minimal risk of data changing during migration. The MongoDB data is essentially static.

However, if any writes happen (e.g., updating archive status), you'll need to:
1. Freeze writes to MongoDB during final migration
2. Or implement dual-write during the transition period

### Response Shape Compatibility

The frontend expects MongoDB-shaped responses:
```json
{
  "documents": [{
    "id": 52804,
    "uuid": "...",
    "type": "episode",
    "attributes": {
      "title": "...",
      "slug": "...",
      ...
    },
    "archive": { ... }
  }]
}
```

The D1 response will be flat rows. **You MUST reshape D1 results to match this format** in the API layer to avoid breaking the frontend. This is the safest approach for Phase 1.

Example reshaping function:
```javascript
function reshapeEpisodeRow(row) {
    return {
        id: row.id,
        uuid: row.uuid,
        type: row.type,
        attributes: {
            title: row.title,
            slug: row.slug,
            number: row.number,
            description: row.description,
            length: row.length,
            original_air_date: row.original_air_date,
            channel_id: row.channel_id,
            channel_slug: row.channel_slug,
            channel_title: row.channel_title,
            season_id: row.season_id,
            season_slug: row.season_slug,
            season_number: row.season_number,
            season_title: row.season_title,
            show_id: row.show_id,
            show_slug: row.show_slug,
            show_title: row.show_title,
            is_sponsors_only: Boolean(row.is_sponsors_only),
            member_tier_i: row.member_tier_i,
            comments: row.comments_count,
        },
        archive: row.archive_id ? {
            id: row.archive_id,
            status: row.archive_status,
            has_subtitle: Boolean(row.has_subtitle),
            files: [] // loaded separately or stored as JSON
        } : null
    };
}
```

### Archive Files Data

The `archive.files` array is the trickiest part. Each episode can have 3-5 files. Options:

1. **Separate `archive_files` table** (normalized) — Clean, but requires a JOIN or second query
2. **JSON column on episodes table** — Store `archive` as a JSON string column, parse in app code. Simpler migration.
3. **Hybrid** — Store archive metadata (id, status, has_subtitle) in columns, files as JSON

**Recommendation:** Option 2 (JSON column for archive) for simplicity:
```sql
ALTER TABLE episodes ADD COLUMN archive_json TEXT;
-- Store the full archive object as JSON
-- Parse it in application code
```

This avoids the archive_files join complexity and the data is only read, never queried by file attributes.

---

## Summary: Quick Reference

| What | From | To | Effort |
|------|------|-----|--------|
| Episodes data | MongoDB `episodes` | D1 `episodes` table | Medium |
| Shows data | MongoDB `shows` | D1 `shows` table | Low |
| Seasons data | Static JSON files | D1 `seasons` table (optional) | Low |
| Full-text search | MongoDB Atlas Search | D1 FTS5 | Medium-High |
| Autocomplete | MongoDB Atlas Search | D1 FTS5 prefix | Medium |
| Random episodes | MongoDB $sample | SQLite ORDER BY RANDOM() | Low |
| Archive file data | Nested in MongoDB | JSON column in D1 | Low |
| Recommendation lookups | MongoDB (after Pinecone) | D1 (after Pinecone) | Low |
| master.json | Static file | Can generate from D1 | Optional |
| Static JSON (132MB) | public/ directory | Can serve from D1 | Optional/Phase 2 |
