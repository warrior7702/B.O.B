/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Bind to all interfaces for Tailscale access
  allowedHosts: ['100.99.198.88', 'localhost', '127.0.0.1'],
}

module.exports = nextConfig