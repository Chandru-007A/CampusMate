/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // Proxy API requests to Python services (for development)
  async rewrites() {
    return [
      {
        source: '/api/predict',
        destination: 'http://localhost:8001/predict', // ML service
      },
      {
        source: '/api/chatbot',
        destination: 'http://localhost:8002/chat',   // Chatbot service
      },
    ];
  },
};

module.exports = nextConfig;
