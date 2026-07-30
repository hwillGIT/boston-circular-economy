/**
 * Custom hook for managing authentication form state and validation.
 */
import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';

/* ── Password Strength Calculator ── */
export function getPasswordStrength(pw: string): { level: number; label: string; key: string } {
  if (!pw) return { level: 0, label: '', key: '' };

  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: 'Weak', key: 'weak' };
  if (score <= 2) return { level: 2, label: 'Fair', key: 'fair' };
  if (score <= 3) return { level: 3, label: 'Strong', key: 'strong' };
  return { level: 4, label: 'Excellent', key: 'excellent' };
}

/* ── Validation ── */
export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return null;
}

export function validatePassword(pw: string): string | null {
  if (!pw) return 'Password is required';
  if (pw.length < 8) return 'Password must be at least 8 characters';
  return null;
}

export function useAuthForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validate
    const errors: Record<string, string> = {};
    const emailErr = validateEmail(email);
    const pwErr = validatePassword(password);

    if (emailErr) errors.email = emailErr;
    if (pwErr) errors.password = pwErr;

    if (mode === 'register') {
      if (!displayName.trim()) errors.displayName = 'Display name is required';
      if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
      if (strength.level < 2) errors.password = 'Password is too weak';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with real API call when backend auth is ready
      // For now, use the existing mock auth
      if (mode === 'register') {
        signIn(displayName, email);
      } else {
        signIn(email.split('@')[0] || 'User', email);
      }
      navigate({ to: '/explore' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
    setFieldErrors({});
    setPassword('');
    setConfirmPassword('');
  };

  return {
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
  };
}
