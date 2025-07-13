/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'leaffystorage.blob.core.windows.net'], // Add any image domains you'll use
  },
  experimental: {
    optimizeCss: true,
  }
};

module.exports = nextConfig;