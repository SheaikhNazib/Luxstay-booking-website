'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  submitLogin,
  submitRegister,
  type AuthFormState,
} from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';

const initialState: AuthFormState = {};

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const action = mode === 'register' ? submitRegister : submitLogin;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="booking-surface auth-form-surface space-y-6">
      <div>
        <p className="section-kicker">{mode === 'register' ? 'Create account' : 'Welcome back'}</p>
        <h1 className="booking-title-ui auth-title">
          {mode === 'register' ? 'Register' : 'Login'}
        </h1>
        <p className="booking-copy-ui auth-copy">
          {mode === 'register'
            ? 'Create your account to manage bookings and continue to checkout.'
            : 'Sign in to continue with your room reservation and Stripe checkout.'}
        </p>
      </div>

      <div className="booking-field-grid auth-grid">
        {mode === 'register' ? (
          <label className="booking-field">
            <span>Full name</span>
            <input name="name" placeholder="John Doe" required type="text" />
          </label>
        ) : null}

        <label className="booking-field">
          <span>Email address</span>
          <input name="email" placeholder="john@example.com" required type="email" />
        </label>

        <label className="booking-field">
          <span>Password</span>
          <input name="password" placeholder="Enter password" required type="password" />
        </label>

        {mode === 'register' ? (
          <label className="booking-field">
            <span>Confirm password</span>
            <input
              name="confirmPassword"
              placeholder="Confirm password"
              required
              type="password"
            />
          </label>
        ) : null}
      </div>

      {state?.error ? <p className="booking-error">{state.error}</p> : null}

      <div className="booking-submit-row">
        <p className="booking-note">
          {mode === 'register' ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link className="auth-inline-link" href={mode === 'register' ? '/login' : '/register'}>
            {mode === 'register' ? 'Login here' : 'Register here'}
          </Link>
        </p>
        <SubmitButton
          className="site-cta"
          idleLabel={mode === 'register' ? 'Create Account' : 'Login'}
          pendingLabel={mode === 'register' ? 'Creating...' : 'Logging in...'}
        />
      </div>
    </form>
  );
}
