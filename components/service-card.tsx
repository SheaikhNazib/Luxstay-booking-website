import Link from 'next/link';
import type { ServiceItem } from '@/lib/types';

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
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
        <p className="line-clamp-2">{service.description}</p>

        <div className="service-card-footer">
          <span>Up to {service.capacity} guests</span>
          <Link href={`/rooms/${service.id}`}>Book room</Link>
        </div>
      </div>
    </article>
  );
}