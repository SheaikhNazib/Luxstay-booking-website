import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const headingFont = Geist({
  variable: '--font-heading',
  subsets: ['latin'],
});

const monoFont = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LuxStay Hotel',
  description: 'Luxury room booking experience with server-side checkout.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${monoFont.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
