const webpack = require('webpack');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
})