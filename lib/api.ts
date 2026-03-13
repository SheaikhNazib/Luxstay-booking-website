import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import {
  AuthResponse,
  AuthUser,
  BookingItem,
  BookingPayload,
  ServiceItem,
} from '@/lib/types';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3001';
export const accessTokenCookieName = 'luxstay_access_token';

async function requestBackend<T>(
  path: string,
  init?: RequestInit,
  accessToken?: string,
): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${backendUrl}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message ?? 'Request failed';
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export const getServices = cache(async (): Promise<ServiceItem[]> => {
  return requestBackend<ServiceItem[]>('/services', {
    method: 'GET',
  });
});

export const getServiceById = cache(async (id: string): Promise<ServiceItem> => {
  return requestBackend<ServiceItem>(`/services/${id}`, {
    method: 'GET',
  });
});

export async function getAccessTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(accessTokenCookieName)?.value ?? null;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return requestBackend<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return requestBackend<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const accessToken = await getAccessTokenFromCookies();
  if (!accessToken) {
    return null;
  }

  try {
    return await requestBackend<AuthUser>(
      '/auth/me',
      {
        method: 'GET',
      },
      accessToken,
    );
  } catch {
    return null;
  }
}

export async function createBooking(payload: BookingPayload): Promise<string> {
  const accessToken = await getAccessTokenFromCookies();
  if (!accessToken) {
    throw new Error('Please sign in to continue with booking.');
  }

  const response = await requestBackend<{ checkoutUrl: string | null }>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, accessToken);

  if (!response.checkoutUrl) {
    throw new Error('Stripe checkout URL is missing.');
  }

  return response.checkoutUrl;
}

export async function getMyBookings(): Promise<BookingItem[]> {
  const accessToken = await getAccessTokenFromCookies();
  if (!accessToken) {
    throw new Error('Please sign in to view your bookings.');
  }

  return requestBackend<BookingItem[]>(
    '/bookings/me',
    {
      method: 'GET',
    },
    accessToken,
  );
}

export async function getMyBookingById(id: string): Promise<BookingItem> {
  const accessToken = await getAccessTokenFromCookies();
  if (!accessToken) {
    throw new Error('Please sign in to view booking details.');
  }

  return requestBackend<BookingItem>(
    `/bookings/me/${id}`,
    {
      method: 'GET',
    },
    accessToken,
  );
}

export async function confirmMyBookingPayment(sessionId: string): Promise<BookingItem> {
  const accessToken = await getAccessTokenFromCookies();
  if (!accessToken) {
    throw new Error('Please sign in to confirm your booking payment.');
  }

  return requestBackend<BookingItem>(
    '/bookings/confirm-payment',
    {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    },
    accessToken,
  );
}