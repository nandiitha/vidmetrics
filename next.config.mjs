/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { hostname: 'i.ytimg.com' },
      { hostname: 'yt3.ggpht.com' },
    ],
  },
}

export default nextConfig