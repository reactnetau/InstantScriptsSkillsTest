const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: './',
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'style.css' }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ico|gif|png|html|jpg|swf|xml|svg)$/,
        type: 'asset/resource',
        generator: { filename: '[path][name][ext]' },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: { loader: 'babel-loader' },
      },
      {
        test: /(flickity|fizzy-ui-utils|get-size|unipointer|imagesloaded)/,
        use: { loader: 'imports-loader', options: { wrapper: 'window' } },
      },
    ],
  },
  resolve: { extensions: ['.js', '.jsx'] },
};
