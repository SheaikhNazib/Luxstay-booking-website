'use client';

import { useActionState, useMemo, useState } from 'react';
import { submitBooking, type BookingFormState } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import type { ServiceItem } from '@/lib/types';

const initialState: BookingFormState = {};

interface BookingFormProps {
  services: ServiceItem[];
  isAuthenticated: boolean;
  userName?: string;
}

export function BookingForm({ services, isAuthenticated, userName }: BookingFormProps) {
  const [state, formAction] = useActionState(submitBooking, initialState);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    services[0]?.id ?? '',
  );
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const { nights, totalPrice } = useMemo(() => {
    if (!checkInDate || !checkOutDate) {
      return { nights: 0, totalPrice: 0 };
    }

    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    const diff = (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24);
    const computedNights = diff > 0 ? Math.ceil(diff) : 0;
    const service = services.find((s) => s.id === selectedServiceId);
    const nightlyRateCents = service ? Math.round(Number(service.price) * 100) : 0;
    const computedTotal = computedNights > 0 ? (nightlyRateCents * computedNights) / 100 : 0;
    return { nights: computedNights, totalPrice: Number(computedTotal.toFixed(2)) };
  }, [checkInDate, checkOutDate, selectedServiceId, services]);

  const validationError = useMemo(() => {
    if (!checkInDate || !checkOutDate) return '';
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    if (outDate <= inDate) return 'Check-out date must be after check-in date.';
    return '';
  }, [checkInDate, checkOutDate]);

  function nextDayIso(dateIso: string) {
    const d = new Date(dateIso);
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  return (
    <form action={formAction} className="booking-surface space-y-6">
      <div className="space-y-3">
        <p className="section-kicker">Choose your room</p>
        <div className="booking-choice-grid">
          {services.map((service) => {
            const selected = selectedServiceId === service.id;

            return (
              <label
                key={service.id}
                className={`booking-choice ${selected ? 'booking-choice-active' : ''}`}
              >
                <input
                  checked={selected}
                  className="sr-only"
                  name="serviceId"
                  onChange={() => setSelectedServiceId(service.id)}
                  type="radio"
                  value={service.id}
                />
                <div className="booking-choice-head">
                  <div>
                    <p className="booking-choice-title">{service.name}</p>
                    <p className="booking-choice-copy">
                      {service.description}
                    </p>
                  </div>
                  <span className="booking-pill">{service.capacity} guests</span>
                </div>
                <div className="booking-choice-foot">
                  <div>
                    <p className="booking-price-label">
                      Starting from
                    </p>
                    <p className="booking-price-value">
                      ${Number(service.price).toFixed(2)}
                    </p>
                  </div>
                  <span className="booking-accent-copy">Luxury suite</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="booking-field-grid">
        <label className="booking-field">
          <span>Booking profile</span>
          <input
            readOnly
            type="text"
            value={isAuthenticated ? `Signed in as ${userName ?? 'Guest'}` : 'Sign in to continue'}
          />
        </label>
        <label className="booking-field">
          <span>Check-in</span>
          <input
            name="checkInDate"
            required
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
        </label>
        <label className="booking-field">
          <span>Check-out</span>
          <input
            name="checkOutDate"
            required
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            min={checkInDate ? nextDayIso(checkInDate) : undefined}
          />
        </label>
      </div>

      {!isAuthenticated ? (
        <p className="booking-error">
          Please sign in or create an account before proceeding to checkout.
        </p>
      ) : null}
      {validationError ? <p className="booking-error">{validationError}</p> : null}
      {state?.error ? <p className="booking-error">{state.error}</p> : null}

      <div className="booking-summary">
        {nights > 0 ? (
          <p className="booking-total">Total: <strong>${totalPrice.toFixed(2)}</strong> — {nights} night{nights > 1 ? 's' : ''}</p>
        ) : (
          <p className="booking-note">Select valid check-in and check-out dates to see the total price.</p>
        )}
      </div>

      <div className="booking-submit-row">
        <p className="booking-note">
          Checkout is handled securely with Stripe. Your booking email is sent after payment confirmation.
        </p>
        <SubmitButton
          className="site-cta"
          idleLabel="Continue to Stripe"
          pendingLabel="Redirecting..."
          disabled={!isAuthenticated || Boolean(validationError) || nights === 0}
        />
      </div>
    </form>
  );
}