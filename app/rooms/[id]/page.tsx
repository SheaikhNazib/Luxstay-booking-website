import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookingForm } from '@/components/booking-form';
import { MainLayout } from '@/components/main-layout';
import { getCurrentUser, getServiceById } from '@/lib/api';

interface RoomDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomDetailsPage({ params }: RoomDetailsPageProps) {
  const { id } = await params;
  const service = await getServiceById(id).catch(() => null);
  const user = await getCurrentUser();

  if (!service) {
    notFound();
  }

  return (
    <MainLayout>
      <section className="featured-section">
        <div className="container">
          <div className="admin-page-head flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Room details</p>
              <h1 className="booking-title-ui">{service.name}</h1>
              <p className="booking-copy-ui">{service.description}</p>
            </div>
            <Link className="site-outline-cta" href="/rooms">
              Back to Rooms
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-6">
              <article className="service-card-ui">
                <div className="service-card-media">
                  {service.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={service.name} className="service-card-image" src={service.image} />
                  ) : (
                    <div className="service-card-placeholder">🏨</div>
                  )}
                  <div className="service-price-badge">
                    <span>${Number(service.price).toFixed(2)}</span>
                    <small>/night</small>
                  </div>
                </div>

                <div className="service-card-body">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-card-footer">
                    <span>Up to {service.capacity} guests</span>
                  </div>
                </div>
              </article>

              <article className="booking-surface space-y-4">
                <p className="section-kicker">Room information</p>
                <div className="booking-field-grid">
                  <label className="booking-field">
                    <span>Capacity</span>
                    <input readOnly type="text" value={`${service.capacity} guests`} />
                  </label>
                  <label className="booking-field">
                    <span>Nightly price</span>
                    <input readOnly type="text" value={`$${Number(service.price).toFixed(2)}`} />
                  </label>
                </div>
              </article>
            </div>

            <BookingForm
              services={[service]}
              isAuthenticated={Boolean(user)}
              userName={user?.name}
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}