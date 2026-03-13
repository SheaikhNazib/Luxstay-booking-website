import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { MainLayout } from '@/components/main-layout';
import { getCurrentUser, getMyBookingById } from '@/lib/api';

interface BookingDetailsPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue));
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const booking = await getMyBookingById(id).catch(() => null);

  if (!booking) {
    notFound();
  }

  return (
    <MainLayout>
      <section className="featured-section">
        <div className="container booking-details-shell">
          <div className="admin-page-head flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Reservation details</p>
              <h1 className="booking-title-ui">{booking.service?.name ?? 'Hotel booking'}</h1>
              <p className="booking-copy-ui">Review your stay dates, payment status, and booking references.</p>
            </div>
            <Link className="site-outline-cta" href="/my-bookings">
              Back to My Bookings
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <article className="service-card-ui">
              <div className="service-card-media">
                {booking.service?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={booking.service.name} className="service-card-image" src={booking.service.image} />
                ) : (
                  <div className="service-card-placeholder">🏨</div>
                )}
                <div className="service-price-badge">
                  <span>${Number(booking.price).toFixed(2)}</span>
                  <small>booking total</small>
                </div>
              </div>

              <div className="service-card-body">
                <h3>{booking.service?.name ?? 'Hotel booking'}</h3>
                <p>{booking.service?.description ?? 'Your booking is confirmed in the system.'}</p>
                <div className="service-card-footer">
                  <span>Up to {booking.service?.capacity ?? '-'} guests</span>
                </div>
              </div>
            </article>

            <div className="booking-details-stack">
              <article className="booking-surface space-y-5">
                <div className="booking-card-top">
                  <p className="booking-choice-title">Booking summary</p>
                  <span className={`booking-status-pill booking-status-${booking.paymentStatus}`}>
                    {booking.paymentStatus}
                  </span>
                </div>

                <div className="booking-details-grid">
                  <div>
                    <span className="booking-price-label">Guest</span>
                    <p className="booking-meta-value">{booking.userName}</p>
                  </div>
                  <div>
                    <span className="booking-price-label">Email</span>
                    <p className="booking-meta-value">{booking.email}</p>
                  </div>
                  <div>
                    <span className="booking-price-label">Check-in</span>
                    <p className="booking-meta-value">{formatDate(booking.checkInDate)}</p>
                  </div>
                  <div>
                    <span className="booking-price-label">Check-out</span>
                    <p className="booking-meta-value">{formatDate(booking.checkOutDate)}</p>
                  </div>
                  <div>
                    <span className="booking-price-label">Booking ID</span>
                    <p className="booking-meta-value booking-reference">{booking.id}</p>
                  </div>
                  {/* <div>
                    <span className="booking-price-label">Stripe session</span>
                    <p className="booking-meta-value booking-reference">{booking.stripeSessionId ?? 'Pending assignment'}</p>
                  </div> */}
                </div>
              </article>

              <article className="booking-surface space-y-3">
                <p className="section-kicker">Need another stay?</p>
                <p className="booking-copy-ui">Browse more rooms or reserve another stay with the same account.</p>
                <Link className="site-cta" href="/#rooms">
                  Browse Rooms
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
