import express from 'express'
import cors from 'cors'
import locationRoutes from './routes/locations.ts'
import activityRoutes from './routes/activities.ts'

import authRoutes from './routes/auth.ts'

const app = express()
const port = process.env['PORT'] ?? 3000

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/ping', (_req, res) => {
  res.json({ message: 'pong' })
})

// API routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/locations', locationRoutes)
app.use('/api/v1/activities', activityRoutes)

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
