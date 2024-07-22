const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
  webpack(config, { nextRuntime }) {
    if (!nextRuntime) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        styles: {
          name: "styles",
          type: "css/mini-extract",
          chunks: "all",
          enforce: true,
        },
      };
    }
    return config;
  },
};
module.exports = withVanillaExtract(nextConfig);

module.exports = {
    images: {
        domains: ['tenor.com',"images.unsplash.com",'res.cloudinary.com'],
        
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
    swcMinify: false,
    
    
}

