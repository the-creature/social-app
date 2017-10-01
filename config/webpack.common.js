const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const outputPath = path.resolve('dist');
const isProduction = process.env.NODE_ENV === 'production';

const babelRules = {
  loader: require.resolve('babel-loader'),
  options: {
    cacheDirectory: !isProduction,
    babelrc: false,
    presets: [['env', { modules: false, loose: true }], 'react'],
    plugins: [
      ['lodash', { id: 'recompact' }],
      'transform-object-rest-spread',
      'syntax-dynamic-import',
      [
        'module-resolver',
        {
          root: [path.resolve('src')],
        },
      ],
    ],
    env: {
      development: {
        plugins: [
          'react-hot-loader/babel',
          'transform-react-jsx-source',
          'transform-react-jsx-self',
          [
            'module-resolver',
            {
              root: [path.resolve('src')],
              transformedMethods: ['module.hot.accept'],
            },
          ],
        ],
      },
      production: {
        plugins: ['transform-react-constant-elements'],
      },
    },
  },
};

module.exports = {
  output: {
    path: outputPath,
  },

  module: {
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.(js)$/,
        exclude: path.resolve('node_modules'),
        include: path.resolve('src'),
        use: babelRules,
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: path.resolve('node_modules'),
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.svg$/,
        use: [babelRules, require.resolve('react-svg-loader')],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin([outputPath], {
      root: process.cwd(),
      verbose: false,
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
    new Dotenv({
      path: process.env.ENV_FILE
        ? path.resolve(process.env.ENV_FILE)
        : path.resolve('.env'),
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
    new CaseSensitivePathsPlugin(),

    // Pull out common imports between async chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'common-lazy',
      children: true,
      minChunks: module =>
        module.context && module.context.indexOf('node_modules') === -1,
    }),

    // Pull out common components from "src/components"
    // NOTE: this mostly helps with reducing styling flash when loading in views
    // NOTE: the needs to come after "common-lazy" Common Chunk to work
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'component-lazy',
      children: true,
      minChunks: module =>
        module.context && module.context.indexOf('components') !== -1,
    }),

    // Pull out common imports from node_modules between async chunks
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-lazy',
      children: true,
      minChunks: module =>
        module.context && module.context.indexOf('node_modules') !== -1,
    }),

    // Pull out common imports from node_modules
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module =>
        module.context && module.context.indexOf('node_modules') !== -1,
    }),

    // Pull out webpack runtime
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      minChunks: Infinity,
    }),
  ],

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
