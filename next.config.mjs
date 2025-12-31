/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Exclude old React Router files from build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    // Exclude src/pages and src/App.jsx (old React Router files)
    config.module.rules.push({
      test: /src\/(pages|App\.jsx)/,
      use: 'ignore-loader',
    })
    return config
  },
  images: {
    unoptimized: false, // Enable image optimization for better performance
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Exclude old React Router files from compilation
  webpack: (config) => {
    // Ignore src/pages and src/App.jsx which use react-router-dom
    config.module.rules.push({
      test: /src\/(pages|App\.jsx|main\.jsx)/,
      use: {
        loader: 'ignore-loader'
      }
    })
    return config
  },
  // Enable compression
  compress: true,
  // Enable React strict mode for better performance
  reactStrictMode: true,
}

export default nextConfig
