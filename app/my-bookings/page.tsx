import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MainLayout } from '@/components/main-layout';
import { getCurrentUser, getMyBookings } from '@/lib/api';

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue));
}

export default async function MyBookingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const bookings = await getMyBookings().catch(() => []);

  return (
    <MainLayout>
      <section className="featured-section">
        <div className="container bookings-page-shell">
          <div className="section-center-head bookings-head-left">
            <p className="section-kicker">Your reservations</p>
            <h1>My Bookings</h1>
            <p>See every room you have reserved and open each booking for full details.</p>
          </div>

          {bookings.length > 0 ? (
            <div className="bookings-list-grid">
              {bookings.map((booking) => (
                <article key={booking.id} className="booking-surface booking-card-ui">
                  <div className="booking-card-top">
                    <div>
                      <p className="booking-choice-title">{booking.service?.name ?? 'Hotel booking'}</p>
                      <p className="booking-choice-copy">{booking.service?.description ?? 'Your reservation details are available below.'}</p>
                    </div>
                    <span className={`booking-status-pill booking-status-${booking.paymentStatus}`}>
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <div className="booking-card-meta-grid">
                    <div>
                      <span className="booking-price-label">Check-in</span>
                      <p className="booking-meta-value">{formatDate(booking.checkInDate)}</p>
                    </div>
                    <div>
                      <span className="booking-price-label">Check-out</span>
                      <p className="booking-meta-value">{formatDate(booking.checkOutDate)}</p>
                    </div>
                    <div>
                      <span className="booking-price-label">Total paid</span>
                      <p className="booking-meta-value">${Number(booking.price).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="booking-card-actions">
                    <Link className="site-outline-cta" href={`/my-bookings/${booking.id}`}>
                      View details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="booking-surface bookings-empty-state">
              <p className="empty-title">No bookings yet</p>
              <p className="empty-copy">Once you complete a reservation, it will appear here with payment and stay details.</p>
              <Link className="site-cta" href="/#rooms">
                Explore rooms
              </Link>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
