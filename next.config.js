/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // Suppress the webpack warning for the Supabase Realtime client
    config.ignoreWarnings = [
      { module: /node_modules\/@supabase\/realtime-js/ }
    ];
    return config;
  },
};

module.exports = nextConfig; 