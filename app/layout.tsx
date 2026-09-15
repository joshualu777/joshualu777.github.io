import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SiteHeader } from './_components/site-header';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://joshualu777.github.io'),
  title: 'Joshua Lu — Software Engineer',
  description: 'Joshua Lu is a UC Berkeley EECS student building reliable systems, infrastructure, and machine-learning products.',
  openGraph: {
    title: 'Joshua Lu — Software Engineer',
    description: 'Systems, infrastructure, and machine learning.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joshua Lu — Software Engineer',
    description: 'Systems, infrastructure, and machine learning.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        id="top"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        {children}
        <footer className="site-footer"><span>Joshua Lu · Berkeley, California</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></footer>
      </body>
    </html>
  );
}
