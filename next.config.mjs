import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack(config, options) {
    // Ensure SVGs are handled separately
    config.module.rules = config.module.rules.filter(rule => {
      return !(rule.test && typeof rule.test === 'function' && rule.test.test('.svg'));
    });
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Add file-loader for videos and other files
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|rtf|doc|docx)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash].[ext]',
          publicPath: '/_next/', // serves from the Next.js path
        },
      },
    });

    return config;
  },
  experimental: {
    optimizePackageImports: ['tailwindcss','swiper','react-toastify','react-countup'],
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
