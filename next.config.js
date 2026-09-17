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
        hostname: 'bomach-os-s3.s3.eu-north-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'bomach-os-s3.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'backend.bomachgroup.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
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
