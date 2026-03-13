'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  accessTokenCookieName,
  createBooking,
  loginUser,
  registerUser,
} from '@/lib/api';

export interface BookingFormState {
  error?: string;
}

export interface AuthFormState {
  error?: string;
}

const defaultCookieConfig = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export async function submitRegister(
  _prevState: AuthFormState | void,
  formData: FormData,
): Promise<AuthFormState | void> {
  const name = formData.get('name')?.toString().trim() ?? '';
  const email = formData.get('email')?.toString().trim() ?? '';
  const password = formData.get('password')?.toString() ?? '';
  const confirmPassword = formData.get('confirmPassword')?.toString() ?? '';

  if (!name || !email || !password || !confirmPassword) {
    return { error: 'Complete all fields before creating your account.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Password and confirm password do not match.' };
  }

  try {
    const auth = await registerUser({
      name,
      email,
      password,
    });
    const cookieStore = await cookies();
    cookieStore.set(accessTokenCookieName, auth.accessToken, defaultCookieConfig);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to register right now.',
    };
  }

  redirect('/');
}

export async function submitLogin(
  _prevState: AuthFormState | void,
  formData: FormData,
): Promise<AuthFormState | void> {
  const email = formData.get('email')?.toString().trim() ?? '';
  const password = formData.get('password')?.toString() ?? '';

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    const auth = await loginUser({ email, password });
    const cookieStore = await cookies();
    cookieStore.set(accessTokenCookieName, auth.accessToken, defaultCookieConfig);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to login right now.',
    };
  }

  redirect('/');
}

export async function submitLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(accessTokenCookieName);
  redirect('/');
}

export async function submitBooking(
  _prevState: BookingFormState | void,
  formData: FormData,
): Promise<BookingFormState | void> {
  const serviceId = formData.get('serviceId')?.toString().trim() ?? '';
  const checkInDate = formData.get('checkInDate')?.toString().trim() ?? '';
  const checkOutDate = formData.get('checkOutDate')?.toString().trim() ?? '';

  if (!serviceId || !checkInDate || !checkOutDate) {
    return { error: 'Complete every field before continuing to checkout.' };
  }

  let checkoutUrl: string | null = null;
  try {
    checkoutUrl = await createBooking({
      serviceId,
      checkInDate,
      checkOutDate,
    });
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Unable to start checkout right now.',
    };
  }

  // Redirect after the try/catch so the NEXT_REDIRECT thrown by `redirect`
  // is not accidentally caught above.
  if (checkoutUrl) redirect(checkoutUrl);
}