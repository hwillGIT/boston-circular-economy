import express from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';
import locationRoutes from './routes/locations.ts';
import activityRoutes from './routes/activities.ts';

import authRoutes from './routes/auth.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env['PORT'] ?? 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/activities', activityRoutes);

// In production, serve the built client
if (process.env['NODE_ENV'] === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express requires the 4-arg signature to register an error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Validation failures are client errors, not server errors (RMM Level 2)
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Invalid request parameters',
      details: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
  }
  console.error(err.stack);
  // Do not leak internal error details to clients
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
