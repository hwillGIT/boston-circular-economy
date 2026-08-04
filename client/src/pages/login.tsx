import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
import { useAuthForm } from '../hooks/useAuthForm';
import { AuthHeroPanel } from '../components/AuthHeroPanel';
import '../styles/forms.css';
import './Login.css';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate({ to: '/explore' });
  }

  const {
    mode,
    displayName,
    setDisplayName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    error,
    fieldErrors,
    isSubmitting,
    strength,
    handleSubmit,
    switchMode,
  } = useAuthForm();

  return (
    <div className="auth-page">
      {/* ── Left Hero Panel ── */}
      <AuthHeroPanel />

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
          <div className="auth-tabs chip-container" role="tablist">
            <button
              className={`auth-tab chip-toggle ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
              role="tab"
              aria-selected={mode === 'login'}
            >
              Sign In
            </button>
            <button
              className={`auth-tab chip-toggle ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
              role="tab"
              aria-selected={mode === 'register'}
            >
              Register
            </button>
          </div>

          {/* ── Error Banner ── */}
          {error && (
            <div className="auth-error form-error" role="alert">
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
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How neighbors will see you"
                  autoComplete="name"
                  className={`form-input ${fieldErrors.displayName ? 'error' : ''}`}
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                className={`form-input ${fieldErrors.email ? 'error' : ''}`}
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === 'login' ? 'Enter your password' : 'Min 8 characters, mix it up'
                  }
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                  aria-describedby={
                    [
                      fieldErrors.password ? 'auth-pw-error' : '',
                      mode === 'register' && password ? 'auth-pw-strength' : '',
                    ]
                      .filter(Boolean)
                      .join(' ') || undefined
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
                    {[1, 2, 3, 4].map((i) => (
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
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
            <button type="submit" className="auth-submit btn-primary" disabled={isSubmitting}>
              {isSubmitting
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign In →'
                  : 'Create Account →'}
            </button>

            {/* Links */}
            {mode === 'login' && (
              <div className="auth-links">
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => alert('Password reset coming soon')}
                >
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
  );
}
