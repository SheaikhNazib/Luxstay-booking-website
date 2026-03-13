export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="site-logo site-logo-footer">
            Lux<span>Stay</span>
          </p>
          <p className="footer-copy">
            Experience refined hospitality, Stripe-secured checkout, and instant booking confirmation backed by your NestJS platform.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Explore</h4>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="#rooms">Rooms & Services</a>
            <a href="#booking">Book Now</a>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">Contact</h4>
          <div className="footer-copy footer-contact">
            <p>123 Luxury Avenue, Suite 1</p>
            <p>New York, NY 10001</p>
            <p>info@luxstay.com</p>
            <p>+1 (555) 000-0000</p>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} LuxStay Hotel. All rights reserved.</p>
        <p>Built with Next.js · NestJS · Stripe</p>
      </div>
    </footer>
  );
}