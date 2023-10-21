/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: [
      'ergo-lib-wasm-nodejs',
      '@emurgo/cardano-serialization-lib-nodejs',
    ],
  },
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

module.exports = nextConfig;
