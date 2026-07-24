import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useAuth } from '../lib/auth'
import './Login.css'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

/* ── Password Strength Calculator ── */
function getPasswordStrength(pw: string): { level: number; label: string; key: string } {
  if (!pw) return { level: 0, label: '', key: '' }

  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { level: 1, label: 'Weak', key: 'weak' }
  if (score <= 2) return { level: 2, label: 'Fair', key: 'fair' }
  if (score <= 3) return { level: 3, label: 'Strong', key: 'strong' }
  return { level: 4, label: 'Excellent', key: 'excellent' }
}

/* ── Validation ── */
function validateEmail(email: string): string | null {
  if (!email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address'
  return null
}

function validatePassword(pw: string): string | null {
  if (!pw) return 'Password is required'
  if (pw.length < 8) return 'Password must be at least 8 characters'
  return null
}

function LoginPage() {
  const navigate = useNavigate()
  const { signIn, isLoggedIn } = useAuth()

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate({ to: '/explore' })
  }

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    // Validate
    const errors: Record<string, string> = {}
    const emailErr = validateEmail(email)
    const pwErr = validatePassword(password)

    if (emailErr) errors.email = emailErr
    if (pwErr) errors.password = pwErr

    if (mode === 'register') {
      if (!displayName.trim()) errors.displayName = 'Display name is required'
      if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
      if (strength.level < 2) errors.password = 'Password is too weak'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Replace with real API call when backend auth is ready
      // For now, use the existing mock auth
      if (mode === 'register') {
        signIn(displayName, email)
      } else {
        signIn(email.split('@')[0] || 'User', email)
      }
      navigate({ to: '/explore' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setError(null)
    setFieldErrors({})
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="auth-page">
      {/* ── Left Hero Panel ── */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-hero-icon">🌿</div>
          <h1>
            Don't toss it.<br />
            <span className="highlight">Fix it. Share it. Swap it.</span>
          </h1>
          <p className="auth-hero-subtitle">
            Join Boston's circular economy community. Find repair shops,
            donation centers, and swap events — track your impact and
            earn credits for keeping stuff out of the landfill.
          </p>
          <div className="auth-hero-stats">
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">12,450</span>
              <span className="auth-hero-stat-label">lbs diverted</span>
            </div>
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">3,100+</span>
              <span className="auth-hero-stat-label">residents</span>
            </div>
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">154</span>
              <span className="auth-hero-stat-label">locations</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p>
              {mode === 'login'
                ? 'Sign in to track your impact and earn credits'
                : 'Start your circular economy journey today'}
            </p>
          </div>

          {/* ── Tab Switcher ── */}
          <div className="auth-tabs" role="tablist">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
              role="tab"
              aria-selected={mode === 'login'}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
              role="tab"
              aria-selected={mode === 'register'}
            >
              Register
            </button>
          </div>

          {/* ── Error Banner ── */}
          {error && (
            <div className="auth-error" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Display Name (register only) */}
            {mode === 'register' && (
              <div className="auth-field">
                <label htmlFor="auth-name">Display Name</label>
                <input
                  id="auth-name"
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="How neighbors will see you"
                  autoComplete="name"
                  className={fieldErrors.displayName ? 'error' : ''}
                  aria-describedby={fieldErrors.displayName ? 'auth-name-error' : undefined}
                />
                {fieldErrors.displayName && (
                  <span id="auth-name-error" className="auth-field-error" role="alert">
                    {fieldErrors.displayName}
                  </span>
                )}
              </div>
            )}

            {/* Email */}
            <div className="auth-field">
              <label htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                className={fieldErrors.email ? 'error' : ''}
                aria-describedby={fieldErrors.email ? 'auth-email-error' : undefined}
              />
              {fieldErrors.email && (
                <span id="auth-email-error" className="auth-field-error" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>
              <div className="auth-password-wrapper">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Min 8 characters, mix it up'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className={fieldErrors.password ? 'error' : ''}
                  aria-describedby={
                    [
                      fieldErrors.password ? 'auth-pw-error' : '',
                      mode === 'register' && password ? 'auth-pw-strength' : '',
                    ].filter(Boolean).join(' ') || undefined
                  }
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {fieldErrors.password && (
                <span id="auth-pw-error" className="auth-field-error" role="alert">
                  {fieldErrors.password}
                </span>
              )}

              {/* Strength Meter (register only) */}
              {mode === 'register' && password && (
                <>
                  <div className="auth-strength-meter" aria-hidden="true">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`auth-strength-segment ${i <= strength.level ? `filled ${strength.key}` : ''}`}
                      />
                    ))}
                  </div>
                  <span
                    id="auth-pw-strength"
                    className={`auth-strength-label ${strength.key}`}
                    aria-live="polite"
                  >
                    {strength.label}
                  </span>
                </>
              )}
            </div>

            {/* Confirm Password (register only) */}
            {mode === 'register' && (
              <div className="auth-field">
                <label htmlFor="auth-confirm">Confirm Password</label>
                <input
                  id="auth-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={fieldErrors.confirmPassword ? 'error' : ''}
                  aria-describedby={fieldErrors.confirmPassword ? 'auth-confirm-error' : undefined}
                />
                {fieldErrors.confirmPassword && (
                  <span id="auth-confirm-error" className="auth-field-error" role="alert">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign In →'
                  : 'Create Account →'
              }
            </button>

            {/* Links */}
            {mode === 'login' && (
              <div className="auth-links">
                <button type="button" className="auth-link" onClick={() => alert('Password reset coming soon')}>
                  Forgot password?
                </button>
                <button type="button" className="auth-link" onClick={() => switchMode('register')}>
                  New here? Register
                </button>
              </div>
            )}
          </form>

          {/* ── Divider ── */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* ── Browse Anonymously ── */}
          <a href="/boston-circular-economy/explore" className="auth-anon-link">
            Browse the map without an account <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}
