const webpackConfig = require('./webpack.config.js')
delete webpackConfig.entry
delete webpackConfig.resolve
webpackConfig.externals = {
  'cheerio': 'window',
  'react/addons': true,
  'react/lib/ExecutionEnvironment': true,
  'react/lib/ReactContext': true
}

// Base

const karmaConfig = (config) => {
  config.set({
    singleRun: true,
    browsers: ['jsdom'],
    frameworks: ['mocha', 'sinon-chai'],
    files: ['test/karma.opts'],
    reporters: ['spec'],
    preprocessors: {
      'test/karma.opts': ['webpack'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
  })
}

// Module API

module.exports = karmaConfig
