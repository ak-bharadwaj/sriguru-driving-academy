import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  workboxOptions: {
    navigateFallbackDenylist: [/^\/admin/, /^\/instructor/, /^\/student/, /^\/api/],
    runtimeCaching: [
      {
        urlPattern: /^\/api(\/.*)?$/,
        handler: 'NetworkOnly',
      },
      {
        urlPattern: /^\/admin(\/.*)?$/,
        handler: 'NetworkOnly',
      },
      {
        urlPattern: /^\/instructor(\/.*)?$/,
        handler: 'NetworkOnly',
      },
      {
        urlPattern: /^\/student(\/.*)?$/,
        handler: 'NetworkOnly',
      },
      // Default cache strategies for fonts, assets and scripts
      {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-font-assets',
        }
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-image-assets',
        }
      },
      {
        urlPattern: /\/_next\/static.+\.js$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'next-static-js-assets',
        }
      },
      {
        urlPattern: /.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'default-pages',
        }
      }
    ]
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'srigurusecretkey1234567890',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*).png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
};

export default withPWA(nextConfig);
