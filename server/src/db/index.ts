import Database from 'better-sqlite3'
import { runMigrations } from './migrations.ts'

const db = new Database(process.env['DATABASE_URL'] ?? 'dev.db')
db.pragma('journal_mode = WAL')

// Haversine distance function for nearby queries
db.function('haversine', (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // meters
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
});

// Ensure activities table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL DEFAULT (datetime('now')),
    action TEXT NOT NULL,
    item TEXT NOT NULL,
    location_id INTEGER,
    location_name TEXT,
    co2_saved REAL DEFAULT 0,
    savings REAL DEFAULT 0,
    credits INTEGER DEFAULT 0,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (location_id) REFERENCES locations(id)
  )
`)

runMigrations(db)

/**
 * The initialized better-sqlite3 database connection instance.
 * Configured with WAL journal mode for better concurrency and includes custom functions (like haversine) and initial table setup.
 * 
 * @category Database
 * @type {import('better-sqlite3').Database}
 * @example
 * import db from './db/index.ts';
 * const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
 */
export default db
