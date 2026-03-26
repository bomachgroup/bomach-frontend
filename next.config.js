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
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || 'https://backend.bomachgroup.com';
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
