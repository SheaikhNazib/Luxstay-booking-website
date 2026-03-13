import Link from 'next/link';
import { MainLayout } from '@/components/main-layout';
import { ServiceCard } from '@/components/service-card';
import { getServices } from '@/lib/api';

const features = [
  {
    icon: '✦',
    title: 'Luxury Rooms',
    desc: 'Curated suites designed for exceptional comfort and style.',
  },
  {
    icon: '⚡',
    title: 'High-Speed Wi-Fi',
    desc: 'Complimentary ultra-fast internet throughout the property.',
  },
  {
    icon: '☕',
    title: '24/7 Concierge',
    desc: 'Round-the-clock personal assistance for every need.',
  },
  {
    icon: '✈',
    title: 'Airport Transfer',
    desc: 'Seamless private transfers to and from the airport.',
  },
];

export default async function Home() {
  const services = await getServices().catch(() => []);
  const featured = services.slice(0, 6);
  const bookingHref = services[0] ? `/rooms/${services[0].id}` : '/#rooms';

  return (
    <MainLayout>
      <section className="hero-section">
        <div className="hero-orb hero-orb-left" />
        <div className="hero-orb hero-orb-right" />

        <div className="container hero-inner">
          <p className="section-kicker">Welcome to LuxStay</p>
          <h1 className="hero-title">
            Where Luxury
            <br />
            <span>Meets Comfort</span>
          </h1>
          <p className="hero-description">
            Discover our handpicked collection of premium rooms and suites, then complete your booking through a secure server-side flow backed by NestJS and Stripe.
          </p>
          <div className="hero-actions">
            <Link className="site-cta" href="/#rooms">
              Explore Rooms
            </Link>
            <Link className="site-ghost-cta" href={bookingHref}>
              Book Your Stay
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-strip-ui">
        <div className="container feature-grid-ui">
          {features.map((feature) => (
            <article key={feature.title} className="feature-item-ui">
              <div className="feature-icon-ui">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="featured-section" id="rooms">
        <div className="container">
          <div className="section-center-head">
            <p className="section-kicker">Our Collection</p>
            <h2>Featured Rooms & Suites</h2>
            <p>
              Each room is loaded from your backend services module and rendered server-side inside the public website.
            </p>
          </div>

          {featured.length > 0 ? (
            <>
              <div className="service-grid-ui">
                {featured.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {services.length > 6 ? (
                <div className="section-button-wrap">
                  <Link className="site-outline-cta" href="/rooms">
                    View All {services.length} Rooms
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <div className="empty-panel-ui">
              <p className="empty-emoji">🏨</p>
              <p className="empty-title">Rooms coming soon</p>
              <p className="empty-copy">Create services in the admin app and they will appear here automatically.</p>
            </div>
          )}
        </div>
      </section>

      <section className="cta-banner-ui">
        <div className="container cta-banner-inner">
          <h2>Ready to Book Your Stay?</h2>
          <p>
            Reserve your room today and let the backend handle payments, booking confirmation, and email delivery.
          </p>
          <Link className="site-cta" href={bookingHref}>
            Book Now
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
