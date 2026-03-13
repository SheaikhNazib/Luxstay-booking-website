import { confirmMyBookingPayment } from '@/lib/api';
import { PaymentStatusPanel } from '@/components/payment-status-panel';

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function BookingSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    return (
      <PaymentStatusPanel
        isConfirmed={false}
        message="Stripe returned you without a checkout session id. Please review My Bookings or contact support if payment was captured."
      />
    );
  }

  try {
    const booking = await confirmMyBookingPayment(sessionId);

    return (
      <PaymentStatusPanel
        bookingId={booking.id}
        isConfirmed={booking.paymentStatus === 'paid'}
        message="Your payment has been verified and your booking status is now up to date."
        sessionId={sessionId}
      />
    );
  } catch (error) {
    return (
      <PaymentStatusPanel
        isConfirmed={false}
        message={error instanceof Error ? error.message : 'We could not verify your payment automatically yet. Please refresh or check My Bookings shortly.'}
        sessionId={sessionId}
      />
    );
  }
}