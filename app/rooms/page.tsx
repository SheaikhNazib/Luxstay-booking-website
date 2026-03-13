import Link from 'next/link';
import { LiveSearchInput } from '../../components/live-search-input';
import { MainLayout } from '@/components/main-layout';
import { ServiceCard } from '@/components/service-card';
import { getServices } from '@/lib/api';

const PAGE_SIZE = 9;

interface RoomsPageProps {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
}

function buildRoomsHref(query: string, page: number) {
  const params = new URLSearchParams();

  if (query) {
    params.set('q', query);
  }

  if (page > 1) {
    params.set('page', String(page));
  }

  const paramString = params.toString();
  return paramString ? `/rooms?${paramString}` : '/rooms';
}

function getPageNumbers(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? '';
  const pageValue = Number(params.page);
  const requestedPage = Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;

  const services = await getServices().catch(() => []);
  const loweredQuery = query.toLowerCase();

  const filteredServices = loweredQuery
    ? services.filter((service) => {
        return (
          service.name.toLowerCase().includes(loweredQuery) ||
          service.description.toLowerCase().includes(loweredQuery)
        );
      })
    : services;

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedServices = filteredServices.slice(startIndex, startIndex + PAGE_SIZE);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <MainLayout>
      <section className="featured-section">
        <div className="container">
          <div className="section-center-head">
            <p className="text-black text-4xl">All Rooms</p>
            <h1>Browse Every Room & Suite</h1>
            <p>Explore the full room inventory loaded from the backend services API.</p>
          </div>

          <LiveSearchInput
            clearHref="/rooms"
            initialQuery={query}
            placeholder="Search rooms by name or description"
          />

          {pagedServices.length > 0 ? (
            <div className="service-grid-ui">
              {pagedServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="empty-panel-ui">
              <p className="empty-emoji">🏨</p>
              <p className="empty-title">No rooms available</p>
              <p className="empty-copy">
                {query
                  ? `No rooms match "${query}". Try another keyword.`
                  : 'Create services in the admin app and they will appear here automatically.'}
              </p>
            </div>
          )}

          {filteredServices.length > 0 ? (
            <nav
              aria-label="Rooms pagination"
              className="mt-8 flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white px-4 py-3"
            >
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {currentPage === 1 ? (
                  <span className="inline-flex min-h-9 min-w-9 cursor-not-allowed items-center justify-center border border-slate-200 bg-slate-50 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Previous
                  </span>
                ) : (
                  <Link
                    className="inline-flex min-h-9 min-w-9 items-center justify-center border border-slate-300 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    href={buildRoomsHref(query, currentPage - 1)}
                  >
                    Previous
                  </Link>
                )}

                {pages.map((page, index) =>
                  page === 'ellipsis' ? (
                    <span aria-hidden="true" className="px-1 text-sm text-slate-400" key={`ellipsis-${index}`}>
                      ...
                    </span>
                  ) : (
                    <Link
                      aria-current={page === currentPage ? 'page' : undefined}
                      className={
                        page === currentPage
                          ? 'inline-flex min-h-9 min-w-9 items-center justify-center border border-navy bg-navy px-3 text-sm font-semibold text-white! visited:text-white! hover:text-white!'
                          : 'inline-flex min-h-9 min-w-9 items-center justify-center border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50'
                      }
                      href={buildRoomsHref(query, page)}
                      key={page}
                    >
                      {page}
                    </Link>
                  ),
                )}

                {currentPage === totalPages ? (
                  <span className="inline-flex min-h-9 min-w-9 cursor-not-allowed items-center justify-center border border-slate-200 bg-slate-50 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Next
                  </span>
                ) : (
                  <Link
                    className="inline-flex min-h-9 min-w-9 items-center justify-center border border-slate-300 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    href={buildRoomsHref(query, currentPage + 1)}
                  >
                    Next
                  </Link>
                )}
              </div>
            </nav>
          ) : null}

          <div className="section-button-wrap">
            <Link className="site-outline-cta" href="/">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
