const merge = require('webpack-merge');
const common = require('./config/webpack.common');

const env = process.env.NODE_ENV || 'development';
const config =
  env === 'production'
    ? merge(common, require('./config/webpack.production'))
    : merge(common, require('./config/webpack.development'));

module.exports = config;
