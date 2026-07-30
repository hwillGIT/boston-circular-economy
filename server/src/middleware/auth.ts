import { Request, Response, NextFunction } from 'express'
import { validateSession } from '../services/authService.ts'

// Augment Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any
      token?: string
    }
  }
}

/**
 * Express middleware that extracts a Bearer token from the Authorization header,
 * validates the session, and attaches the user and token to the request object if valid.
 * Proceeds to the next middleware regardless of authentication success.
 * 
 * @category Auth
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 * @param {NextFunction} next The next middleware function.
 * @example
 * ```ts
 * app.use(authenticate);
 * ```
 * @see {@link requireAuth}
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return next()
  }

  const token = authHeader.substring(7)
  const user = validateSession(token)

  if (user) {
    req.user = user
    req.token = token
  }

  next()
}

/**
 * Express middleware that enforces authentication by ensuring a user object exists on the request.
 * Responds with a 401 Unauthorized error if the user is not authenticated.
 * 
 * @category Auth
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 * @param {NextFunction} next The next middleware function.
 * @example
 * ```ts
 * router.get('/protected', requireAuth, (req, res) => { // handle });
 * ```
 * @see {@link authenticate}
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}

/**
 * Express middleware factory that restricts access to users with specific roles.
 * Responds with 401 Unauthorized if not authenticated, or 403 Forbidden if the user's role is not authorized.
 * 
 * @category Auth
 * @param {...string[]} roles A list of allowed roles.
 * @returns {import('express').RequestHandler} An Express middleware function.
 * @example
 * ```ts
 * router.post('/admin', requireRole('admin', 'superadmin'), (req, res) => { // handle });
 * ```
 * @see {@link requireAuth}
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }
    next()
  }
}
