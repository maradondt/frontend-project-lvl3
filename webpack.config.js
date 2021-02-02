/* eslint-disable import/no-unresolved */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [{
          // inject CSS to page
          loader: 'style-loader',
        }, {
          // translates CSS into CommonJS modules
          loader: 'css-loader',
        }, {
          // Run postcss actions
          loader: 'postcss-loader',
          options: {
            // `postcssOptions` is needed for postcss 8.x;
            // if you use postcss 7.x skip the key
            postcssOptions: {
              // postcss plugins, can be exported to postcss.config.js
              plugins: () => [
                // eslint-disable-next-line global-require
                require('autoprefixer'),
              ],
            },
          },
        }, {
          // compiles Sass to CSS
          loader: 'sass-loader',
        }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template.html',
    }),
  ],
};