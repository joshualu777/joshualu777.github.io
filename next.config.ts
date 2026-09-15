import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // Avoid export-time redirects; the build arranges directory index files.
  trailingSlash: false,
  images: { unoptimized: true },
};

export default nextConfig;
