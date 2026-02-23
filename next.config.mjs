/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'g.intellicon.tw',
        pathname: '/data/iching/**'
      }
    ]
  }
};

export default nextConfig;
