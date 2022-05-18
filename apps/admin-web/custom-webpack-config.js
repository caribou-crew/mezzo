// Helper for combining webpack config objects
const { merge } = require('webpack-merge');
const nrwlConfig = require('@nrwl/react/plugins/webpack.js'); // require the main @nrwl/react/plugins/webpack configuration function.

module.exports = (config, context) => {
  nrwlConfig(config); // first call it so that it @nrwl/react plugin adds its configs,
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
};
