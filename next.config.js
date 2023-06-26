const withMDX = require('@next/mdx')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  distDir: 'dist',
  images: {
    domains: ['pbs.twimg.com'],
    unoptimized: true, // disable as we use export mode (which is not compatible see https://nextjs.org/docs/messages/export-image-api)
  },
  headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
             key: 'Content-Security-Policy',
              value: ` default-src 'none'; connect-src 'self' https://observatory-demo.vercel.app; img-src 'self' https://images.ctfassets.net https://secure-content.meetupstatic.com; script-src 'self' 'unsafe-inline' https://code.jquery.com/jquery-3.2.1.slim.min.js; style-src 'self' 'unsafe-inline'; frame-ancestors 'self'; manifest-src 'self'; base-uri 'self'; form-action 'self'`
          },
            {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
            },
            {
                key: 'Referrer-Policy',
                value: 'no-referrer, strict-origin-when-cross-origin'
            },
            {
                key: 'X-XSS-Protection',
                value: '1; mode=block'
            }
        ],
      },
    ];
  },
};

module.exports = withMDX(nextConfig);
