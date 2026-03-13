import Link from 'next/link';

interface PaymentStatusPanelProps {
  sessionId?: string;
  bookingId?: string;
  isConfirmed: boolean;
  message: string;
}

export function PaymentStatusPanel({
  sessionId,
  bookingId,
  isConfirmed,
  message,
}: PaymentStatusPanelProps) {
  return (
    <main className="status-page">
      <section className="status-card">
        <p className="eyebrow">{isConfirmed ? 'Payment received' : 'Payment processing'}</p>
        <h1>{isConfirmed ? 'Booking confirmed.' : 'Payment verification pending.'}</h1>
        <p>{message}</p>
        <div className="status-metadata">
          <span>Session ID</span>
          <strong>{sessionId ?? 'Unavailable'}</strong>
        </div>
        {bookingId ? (
          <div className="status-metadata">
            <span>Booking ID</span>
            <strong>{bookingId}</strong>
          </div>
        ) : null}
        <div className="hero-actions">
          <Link className="site-cta" href="/my-bookings">
            View My Bookings
          </Link>
          <Link className="site-outline-cta" href="/">
            Return to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
