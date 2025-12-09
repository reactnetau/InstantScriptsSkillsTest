const path = require('path');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    'webpack-hot-middleware/client?reload=true', // enable HMR
    './src/app.js', // your main entry
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      // JavaScript / JSX
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [require.resolve('react-refresh/babel')],
          },
        },
      },
      // SCSS
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Images / icons / fonts
      {
        test: /\.(ico|gif|png|jpg|jpeg|svg|xml|html)$/,
        type: 'asset/resource',
        generator: {
          filename: '[path][name][ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(), // enables React Fast Refresh
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
