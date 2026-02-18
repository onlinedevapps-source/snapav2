/**
 * app/layout.tsx
 * --------------
 * Root layout — sets up fonts, metadata, and global styles.
 * Uses Next.js 14 App Router conventions.
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// ── Google Font: Inter ────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Snap Pro — Particles in Perfect Motion',
  description:
    'A next-generation interactive experience built with HTML Canvas and GSAP. 130 particles converge, breathe, and drift in real time.',
  keywords: ['particle animation', 'interactive', 'Next.js', 'canvas', 'GSAP'],
  openGraph: {
    title: 'Snap Pro — Particles in Perfect Motion',
    description: 'Interactive particle hero animation built with Next.js 14 and HTML Canvas.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#050510',
  width: 'device-width',
  initialScale: 1,
};

// ── Root Layout ───────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
