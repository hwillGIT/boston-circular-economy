import assert from 'node:assert/strict';
import { once } from 'node:events';
import { after, test } from 'node:test';
import express from 'express';

// Set the database before importing any application module.
process.env.SQLITE_PATH = ':memory:';
const { default: db } = await import('../dist/db/index.js');
const { default: authRoutes } = await import('../dist/routes/auth.js');
const { default: activityRoutes } = await import('../dist/routes/activities.js');
const { authenticate, requireRole } = await import('../dist/middleware/auth.js');
const { hashToken } = await import('../dist/services/authService.js');

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/activities', activityRoutes);
app.get('/role-check', authenticate, requireRole('admin'), (_req, res) => res.sendStatus(204));
const server = app.listen(0, '127.0.0.1');
await once(server, 'listening');
const baseUrl = `http://127.0.0.1:${server.address().port}`;

after(async () => {
  server.closeAllConnections();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  db.close();
});

function request(path, { token, body, method = 'GET' } = {}) {
  return fetch(baseUrl + path, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

async function register(email) {
  const response = await request('/api/v1/auth/register', {
    method: 'POST',
    body: { email, password: 'ExamplePass1!', displayName: 'Example Resident' },
  });
  assert.equal(response.status, 201);
  return response.json();
}

test('login and session lookup preserve the public user fields', async () => {
  const registered = await register('identity@example.test');
  const rejected = await request('/api/v1/auth/login', {
    method: 'POST',
    body: { email: 'identity@example.test', password: 'wrong' },
  });
  assert.equal(rejected.status, 401);

  const login = await request('/api/v1/auth/login', {
    method: 'POST',
    body: { email: 'identity@example.test', password: 'ExamplePass1!' },
  });
  assert.equal(login.status, 200);
  const { token } = await login.json();
  const response = await request('/api/v1/auth/me', { token });
  assert.equal(response.status, 200);
  const { user } = await response.json();
  assert.equal(user.id, registered.user.id);
  assert.equal(user.displayName, 'Example Resident');
  assert.equal(user.role, 'user');
  assert.equal(user.verified, 0);
  assert.equal(user.neighborhood, null);
  assert.equal(user.status, 'active');
  assert.equal('password_hash' in user, false);
  assert.equal('token_hash' in user, false);
});

test('refresh replaces the old token and logout revokes the replacement', async () => {
  const { token } = await register('refresh@example.test');
  const refresh = await request('/api/v1/auth/refresh', { method: 'POST', token });
  assert.equal(refresh.status, 200);
  const replacement = await refresh.json();
  assert.equal((await request('/api/v1/auth/me', { token })).status, 401);
  assert.equal((await request('/api/v1/auth/me', { token: replacement.token })).status, 200);

  const logout = await request('/api/v1/auth/logout', {
    method: 'POST',
    token: replacement.token,
  });
  assert.equal(logout.status, 204);
  assert.equal((await request('/api/v1/auth/me', { token: replacement.token })).status, 401);
});

test('an expired session is rejected and removed', async () => {
  const { token } = await register('expired@example.test');
  db.prepare('UPDATE sessions SET expires_at = ? WHERE token_hash = ?').run(
    '2000-01-01T00:00:00.000Z',
    hashToken(token),
  );
  assert.equal((await request('/api/v1/auth/me', { token })).status, 401);
  assert.equal(
    db.prepare('SELECT id FROM sessions WHERE token_hash = ?').get(hashToken(token)),
    undefined,
  );
});

test('private routes and role checks reject callers without the required identity', async () => {
  assert.equal((await request('/api/v1/activities')).status, 401);
  assert.equal((await request('/role-check')).status, 401);
  const { user, token } = await register('roles@example.test');
  assert.equal((await request('/role-check', { token })).status, 403);
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run('admin', user.id);
  assert.equal((await request('/role-check', { token })).status, 204);
});
