/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  },
  output: 'standalone',
  env: {
    NODE_ENV: 'production'
  }
}

module.exports = nextConfig