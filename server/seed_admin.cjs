const Database = require('better-sqlite3');
const crypto = require('crypto');

const db = new Database('dev.db');

// Create users table
db.exec(`
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
  )
`);

// Create sessions table
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    last_active TEXT DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// Hash password: admin (scrypt — same format as authService)
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.scryptSync('admin', salt, 64).toString('hex');
const pwHash = salt + ':' + hash;
const id = crypto.randomUUID();

// Clear and insert admin
db.prepare('DELETE FROM users WHERE email = ?').run('admin@localhost');

db.prepare(
  `
  INSERT INTO users (id, email, password_hash, display_name, role, neighborhood, verified, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`,
).run(id, 'admin@localhost', pwHash, 'Admin', 'admin', 'Back Bay', 1, 'active');

// Verify
const users = db.prepare('SELECT id, email, display_name, role, status FROM users').all();
console.log('=== Users in DB ===');
users.forEach((u) =>
  console.log(
    '  ' + u.display_name + ' (' + u.email + ') role: ' + u.role + ' status: ' + u.status,
  ),
);
console.log('\nAdmin credentials: admin@localhost / admin');

db.close();
