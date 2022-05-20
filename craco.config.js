const webpack = require('webpack')

/**
 * Fallbacks are required due to webpack 5 no longer supplying node polyfills by default
 * Rather than eject from CRA, we use craco to patch in what we need. What is included here is
 * only what is required to resolve all compiler errors.
 * See https://github.com/facebook/create-react-app/issues/11756
 */

module.exports = {
  webpack: {
    configure: {
      ignoreWarnings: [/Failed to parse source map/],
      resolve: {
        fallback: {
          util: require.resolve('util/'),
          buffer: require.resolve("buffer"),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          // process: "process/browser",
        })
      ],
    },
  },
}
