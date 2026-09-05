import { Router } from 'express';
import { z } from 'zod';
import db from '../db/index.ts';
import { authenticate, requireAuth } from '../middleware/auth.ts';

const router = Router();

// All activity data is private to the signed-in user
router.use(authenticate, requireAuth);

/* ── CO2 impact estimates by action type (kg) ── */
const CO2_ESTIMATES: Record<string, number> = {
  repair: 5.8,
  donate: 3.2,
  swap: 4.5,
  recycle: 1.5,
  mend: 2.8,
  refurbish: 6.2,
  compost: 0.8,
  other: 2.0,
};

/* ── Credit tiers by action type ── */
const CREDIT_TIERS: Record<string, number> = {
  repair: 2,
  donate: 2,
  swap: 3,
  recycle: 1,
  mend: 2,
  refurbish: 3,
  compost: 1,
  other: 1,
};

/* ── List activities ── */
const listActivitiesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(100),
});

router.get('/', (req, res, next) => {
  try {
    const { page, limit } = listActivitiesSchema.parse(req.query);
    const offset = (page - 1) * limit;

    const totalRow = db
      .prepare('SELECT COUNT(*) as total FROM activities WHERE user_id = ?')
      .get(req.user!.id) as { total: number };

    const activities = db
      .prepare(
        `
      SELECT a.*, l.name as location_name
      FROM activities a
      LEFT JOIN locations l ON a.location_id = l.id
      WHERE a.user_id = ?
      ORDER BY a.date DESC
      LIMIT ? OFFSET ?
    `,
      )
      .all(req.user!.id, limit, offset);

    res.json({ data: activities, meta: { page, limit, total: totalRow.total } });
  } catch (err) {
    next(err);
  }
});

/* ── Log a new activity ── */
const createActivitySchema = z.object({
  action: z.string().min(1, 'Action is required'),
  item: z.string().min(1, 'Item description is required'),
  location_id: z.number().int().positive().optional().nullable(),
  location_name: z.string().optional(),
  date: z.string().optional(), // ISO date string, defaults to now
  co2_saved: z.number().optional(),
  savings: z.number().optional(),
  credits: z.number().int().optional(),
  notes: z.string().optional(),
});

router.post('/', (req, res, next) => {
  try {
    const input = createActivitySchema.parse(req.body);

    // Auto-calculate CO2 and credits if not provided
    const actionKey = input.action.toLowerCase().replace(/[^a-z]/g, '');
    const co2 = input.co2_saved ?? CO2_ESTIMATES[actionKey] ?? CO2_ESTIMATES['other']!;
    const credits = input.credits ?? CREDIT_TIERS[actionKey] ?? CREDIT_TIERS['other']!;
    const savings = input.savings ?? 0;

    // Resolve location name if location_id provided but no name
    let locationName = input.location_name;
    if (input.location_id && !locationName) {
      const loc = db.prepare('SELECT name FROM locations WHERE id = ?').get(input.location_id) as
        { name: string } | undefined;
      locationName = loc?.name;
    }

    const result = db
      .prepare(
        `
      INSERT INTO activities (user_id, date, action, item, location_id, location_name, co2_saved, savings, credits, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        req.user!.id,
        input.date || new Date().toISOString(),
        input.action,
        input.item,
        input.location_id ?? null,
        locationName ?? null,
        co2,
        savings,
        credits,
        input.notes ?? null,
      );

    const activity = db
      .prepare('SELECT * FROM activities WHERE id = ?')
      .get(result.lastInsertRowid);

    res.status(201).json({ data: activity });
  } catch (err) {
    next(err);
  }
});

/* ── Get aggregated impact stats ── */
router.get('/stats', (req, res, next) => {
  try {
    const stats = db
      .prepare(
        `
      SELECT
        COUNT(*) as items_diverted,
        COALESCE(SUM(co2_saved), 0) as co2_prevented,
        COALESCE(SUM(savings), 0) as money_saved,
        COALESCE(SUM(credits), 0) as credits_earned
      FROM activities
      WHERE user_id = ?
    `,
      )
      .get(req.user!.id);

    res.json({ data: stats });
  } catch (err) {
    next(err);
  }
});

/* ── Delete an activity ── */
router.delete('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params['id']!, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid activity ID' });
    }

    const result = db
      .prepare('DELETE FROM activities WHERE id = ? AND user_id = ?')
      .run(id, req.user!.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * Express router instance containing routes for managing circular economy activities (list, create, get stats, delete).
 *
 * @category Routes
 * @type {import('express').Router}
 * @example
 * import activitiesRoutes from './routes/activities.ts';
 * app.use('/api/activities', activitiesRoutes);
 */
export default router;
