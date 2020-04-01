const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const ExtractCssPlugin = require('mini-css-extract-plugin')
const NODE_ENV = process.env.NODE_ENV || 'development'
const DEBUG = process.env.DEBUG || false

// Base

const webpackConfig = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'datapackage-ui.js',
    library: 'datapackageUI',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ExtractCssPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  plugins: [new webpack.EnvironmentPlugin({ NODE_ENV, DEBUG })],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
  },
  performance: {
    hints: false,
  },
  node: {
    fs: 'empty',
    http: 'empty',
    https: 'empty',
  },
}

// Development

if (NODE_ENV === 'development') {
  webpackConfig.mode = 'development'
  webpackConfig.devServer = { hot: true }
  webpackConfig.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractCssPlugin({ filename: 'datapackage-ui.css' }),
    ...webpackConfig.plugins,
  ]
}

// Testing

if (NODE_ENV === 'testing') {
  webpackConfig.mode = 'development'
  webpackConfig.plugins = [
    new ExtractCssPlugin({ filename: 'datapackage-ui.css' }),
    ...webpackConfig.plugins,
  ]
}

// Production

if (NODE_ENV === 'production') {
  webpackConfig.mode = 'production'
  webpackConfig.output.filename = 'datapackage-ui.min.js'
  webpackConfig.devtool = '#source-map'
  webpackConfig.plugins = [
    ...webpackConfig.plugins,
    new ExtractCssPlugin({ filename: 'datapackage-ui.min.css' }),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ]
}

// Module API

module.exports = webpackConfig
