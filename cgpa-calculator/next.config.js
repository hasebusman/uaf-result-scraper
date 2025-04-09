/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['jspdf', 'jspdf-autotable'],
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      path: false,
      stream: false,
      process: false,
      canvas: false,
      ...config.resolve.fallback
    };
    
    return config;
  },
  poweredByHeader: false,
}

module.exports = nextConfig
