// Helper for combining webpack config objects
const { merge } = require('webpack-merge');
const { composePlugins, withNx } = require('@nrwl/webpack');
const { withReact } = require('@nrwl/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  return merge(config, {
    devServer: {
      historyApiFallback: {
        index: `/mezzo/`,
      },
      proxy: [
        {
          context: ['**', '!/mezzo/**'],
          target: 'http://localhost:8000',
          secure: false,
        },
      ],
    },
  });
});
