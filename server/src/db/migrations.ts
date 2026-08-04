import type { Database } from 'better-sqlite3';

/**
 * Executes database migrations to ensure required tables and schema alterations are applied.
 * Creates 'users' and 'sessions' tables if they do not exist, and attempts to alter the 'activities' table safely.
 *
 * @category Database
 * @param {import('better-sqlite3').Database} db The database connection instance to run migrations on.
 * @example
 * import db from './index.ts';
 * runMigrations(db);
 */
export function runMigrations(db: Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data_source TEXT NOT NULL,
      data_source_id TEXT NOT NULL,
      name TEXT NOT NULL,
      lat REAL NOT NULL,
      lon REAL NOT NULL,
      street TEXT,
      city TEXT,
      state TEXT,
      postcode TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      social TEXT,
      opening_hours TEXT,
      is_persistent INTEGER DEFAULT 1,
      last_verified TEXT,
      rating REAL,
      review_count INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(data_source, data_source_id)
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
      activity TEXT NOT NULL,
      item_category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      avatar_url TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      neighborhood TEXT,
      verified INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      last_active TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  try {
    db.exec(`ALTER TABLE activities ADD COLUMN user_id TEXT REFERENCES users(id)`);
  } catch (error) {
    // Ignore if column already exists
    if (error instanceof Error && !error.message.includes('duplicate column name')) {
      console.error('Error adding user_id to activities:', error);
    }
  }
}
