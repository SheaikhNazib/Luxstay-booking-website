'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { AuthUser } from '@/lib/types';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#rooms', label: 'Rooms & Services' },
  { href: '/#booking', label: 'Book Now' },
];

interface NavbarProps {
  user: AuthUser | null;
  onLogout: () => Promise<void>;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const initials = useMemo(() => {
    if (!user) {
      return '';
    }

    const parts = user.name.trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  }, [user]);

  useEffect(() => {
    setProfileOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!profileMenuRef.current) {
        return;
      }

      if (!profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <header className="site-header">
      <div className="container shell-row">
        <Link className="site-logo" href="/">
          Lux<span>Stay</span>
        </Link>

        <nav className="desktop-nav">
          {navLinks.map((link) => {
            const active = pathname === '/' && link.href === '/';

            return (
              <Link
                key={link.href}
                className={active ? 'nav-link nav-link-active' : 'nav-link'}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}

          {user ? (
            <Link
              className={pathname === '/my-bookings' ? 'nav-link nav-link-active' : 'nav-link'}
              href="/my-bookings"
            >
              My Bookings
            </Link>
          ) : null}
        </nav>

        {user ? (
          <div className="profile-menu" ref={profileMenuRef}>
            <button
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
              className="profile-trigger"
              onClick={() => setProfileOpen((open) => !open)}
              type="button"
            >
              <span className="profile-avatar">{initials || 'U'}</span>
            </button>

            {profileOpen ? (
              <div className="profile-dropdown">
                <p className="profile-name">{user.name}</p>
                <p className="profile-email">{user.email}</p>
                <form action={onLogout} className="profile-logout-form">
                  <button className="profile-logout-btn" type="submit">
                    Logout
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="desktop-auth-links">
            <Link className="site-ghost-cta" href="/login">
              Login
            </Link>
            <Link className="site-cta desktop-cta" href="/register">
              Register
            </Link>
          </div>
        )}

        <button
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
          className="mobile-toggle"
          onClick={() => setMobileOpen((open) => !open)}
          type="button"
        >
          {mobileOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {mobileOpen ? (
        <div className="mobile-nav-wrap">
          <nav className="container mobile-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="mobile-nav-link"
                href={link.href}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {user ? (
              <div className="mobile-profile-panel">
                <p className="mobile-profile-name">{user.name}</p>
                <p className="mobile-profile-email">{user.email}</p>
                <Link className="mobile-nav-link" href="/my-bookings" onClick={() => setMobileOpen(false)}>
                  My Bookings
                </Link>
                <form action={onLogout}>
                  <button className="mobile-nav-link mobile-logout-btn" type="submit">
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link className="mobile-nav-link" href="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link className="mobile-nav-link" href="/register" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}