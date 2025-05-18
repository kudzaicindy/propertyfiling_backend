/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000','https://propertyfiling.vercel.app/']
    }
  },
  output: 'standalone'
}

module.exports = nextConfig