'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface LiveSearchInputProps {
  initialQuery: string;
  placeholder: string;
  clearHref: string;
  queryKey?: string;
  pageKey?: string;
  debounceMs?: number;
}

export function LiveSearchInput({
  initialQuery,
  placeholder,
  clearHref,
  queryKey = 'q',
  pageKey = 'page',
  debounceMs = 250,
}: LiveSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);

  const currentUrl = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmed = value.trim();
      const params = new URLSearchParams(searchParams.toString());

      if (trimmed) {
        params.set(queryKey, trimmed);
      } else {
        params.delete(queryKey);
      }

      params.delete(pageKey);

      const nextQuery = params.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false });
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [currentUrl, debounceMs, pageKey, pathname, queryKey, router, searchParams, value]);

  return (
    <div className="mx-auto mb-8 flex w-full max-w-2xl gap-3">
      <input
        className="h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-gold focus:outline-none"
        name={queryKey}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
      {value ? (
        <Link className="site-outline-cta" href={clearHref}>
          Clear
        </Link>
      ) : null}
    </div>
  );
}
