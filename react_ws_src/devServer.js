const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware'); // modern replacement

const app = express();
const compiler = webpack(config);

// Webpack Dev Middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: 'minimal', // less verbose output
  })
);

// Webpack Hot Middleware
app.use(webpackHotMiddleware(compiler));

// Static files
app.use(express.static(path.join(__dirname, 'static')));

// Proxy /images requests
app.use(
  '/images',
  createProxyMiddleware({
    target: 'http://z2/projs/kisla/X-react-starter/dev/WS/images',
    changeOrigin: true,
    pathRewrite: {
      '^/images': '', // optional, if your backend paths don't have /images prefix
    },
  })
);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Listening at http://0.0.0.0:${PORT}`);
});