const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { send } = require('micro');
const config = require('./webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const errorOverlayMiddleware = require('react-error-overlay/middleware')();

const compiler = webpack(config);
compiler.apply(new webpack.ProgressPlugin());

const devMiddlewareInstance = webpackDevMiddleware(compiler, {
  quiet: true,
  publicPath: config.output.publicPath,
});

const hotMiddlewareInstance = webpackHotMiddleware(compiler, {
  log: () => {},
});

const devMiddleware = next => (req, res) =>
  devMiddlewareInstance(req, res, () => next(req, res));

const hotMiddleware = next => (req, res) =>
  hotMiddlewareInstance(req, res, () => next(req, res));

const errMiddleware = next => (req, res) =>
  errorOverlayMiddleware(req, res, () => next(req, res));

const microService = (req, res) =>
  send(res, 200, fs.readFileSync(path.resolve('dist', 'index.html'), 'utf8'));

module.exports = [hotMiddleware, devMiddleware, errMiddleware].reduce(
  (middleware, callback) => callback(middleware),
  microService
);
