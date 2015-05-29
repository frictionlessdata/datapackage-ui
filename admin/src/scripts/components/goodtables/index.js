var _ = require('underscore');
var API_URL = 'http://goodtables.okfnlabs.org/api/';
var Promise = require('promise-polyfill');
var request = require('superagent');


module.exports = function(options) {
  this.options = _.extend({
    fail_fast        : true,
    format           : 'csv',
    ignore_empty_rows: false,
    method           : 'get',
    report_limit     : 1000,
    row_limit        : 20000
  }, options);

  if(!_.contains(['get', 'post'], this.options.method))
    throw new Error('.method should be "get" or "post"');

  this.run = (function(data, schema) {
    if(!data)
      throw new Error('You need to provide data file to validate');

    return new Promise((function(RS, RJ) {
      request[this.options.method](API_URL + 'run')
        .query(_.omit(this.options, 'method'))
        .end(function(E, R) { RS(true); });
    }).bind(this));
  }).bind(this);

  return this;
}