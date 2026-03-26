/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'backend',
      },
      {
        protocol: 'http',
        hostname: 'nginx',
      },
    ],
    unoptimized: true,
  },
  // Proxy /media/ requests to Django backend
  async rewrites() {
    // In Docker, backend is reachable via service name
    const backendUrl = process.env.BACKEND_INTERNAL_URL || 'http://backend:8000';
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
