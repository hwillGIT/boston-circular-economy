import { Router } from 'express'
import { z } from 'zod'
import db from '../db/index.ts'

const router = Router()

/* ── List locations ── */
const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  activity: z.string().optional(),
  category: z.string().optional(),
  data_source: z.string().optional(),
})

router.get('/', (req, res, next) => {
  try {
    const { page, limit, activity, category, data_source } = listQuerySchema.parse(req.query)
    const offset = (page - 1) * limit

    let query = `
      SELECT DISTINCT l.* 
      FROM locations l
      LEFT JOIN services s ON l.id = s.location_id
      WHERE 1=1
    `
    const params: unknown[] = []

    if (activity) {
      query += ` AND s.activity = ?`
      params.push(activity)
    }
    if (category) {
      query += ` AND s.item_category = ?`
      params.push(category)
    }
    if (data_source) {
      query += ` AND l.data_source = ?`
      params.push(data_source)
    }

    const countQuery = `SELECT COUNT(*) as total FROM (${query})`
    const totalRow = db.prepare(countQuery).get(...params) as { total: number }
    const total = totalRow.total

    query += ` LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const locations = db.prepare(query).all(...params)

    res.json({
      data: locations,
      meta: { page, limit, total },
    })
  } catch (err) {
    next(err)
  }
})

/* ── Nearby locations ── */
const nearbyQuerySchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  radius_m: z.coerce.number().positive(),
})

router.get('/nearby', (req, res, next) => {
  try {
    const { lat, lng, radius_m } = nearbyQuerySchema.parse(req.query)

    const query = `
      SELECT *, haversine(?, ?, lat, lon) as distance
      FROM locations
      WHERE distance <= ?
      ORDER BY distance ASC
    `
    const locations = db.prepare(query).all(lat, lng, radius_m)
    res.json({ data: locations })
  } catch (err) {
    next(err)
  }
})

/* ── Single location with services ── */
router.get('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params['id']!, 10)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid location ID' })
    }

    const location = db.prepare('SELECT * FROM locations WHERE id = ?').get(id)
    if (!location) {
      return res.status(404).json({ error: 'Location not found' })
    }

    const services = db.prepare('SELECT * FROM services WHERE location_id = ?').all(id)
    res.json({ data: { ...(location as object), services } })
  } catch (err) {
    next(err)
  }
})

/**
 * Express router instance containing routes for querying locations (list, nearby, single with services).
 * 
 * @category Routes
 * @type {import('express').Router}
 * @example
 * import locationsRoutes from './routes/locations.ts';
 * app.use('/api/locations', locationsRoutes);
 */
export default router
