export default function BookingCancelPage() {
  return (
    <main className="status-page">
      <section className="status-card">
        <p className="eyebrow">Checkout cancelled</p>
        <h1>Your booking was not completed.</h1>
        <p>
          No payment was captured. You can return to the homepage, adjust dates or room selection, and start
          checkout again.
        </p>
        <a className="cta-primary inline-flex w-fit items-center justify-center" href="/#booking">
          Try again
        </a>
      </section>
    </main>
  );
}