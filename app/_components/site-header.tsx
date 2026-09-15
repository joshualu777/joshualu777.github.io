'use client';

import { usePathname } from 'next/navigation';

const pages = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/research-teaching', label: 'Research & Teaching' },
  { href: '/collection', label: 'Collection' },
];

export function SiteHeader() {
  const pathname = usePathname()?.replace(/\/$/, '') || '/';
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/">
          Joshua Lu
        </a>
        <nav aria-label="Main navigation">
          {pages.map((page) => (
            <a
              key={page.href}
              href={page.href}
              aria-current={pathname === page.href ? 'page' : undefined}
            >
              {page.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
