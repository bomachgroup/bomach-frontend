/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'd1yzddjh14f4tu.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'backend.bomachgroup.com',
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
};

module.exports = nextConfig;
