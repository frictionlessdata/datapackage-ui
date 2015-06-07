var _ = require('underscore');
var API_URL = 'http://goodtables.okfnlabs.org/api/';
var Promise = require('promise-polyfill');
var request = require('superagent');


function ValidationReport(report) {
  var errors = _.where(report.results, {result_level: 'error'});


  this.isValid = function() { return !Boolean(errors.length); }
  this.getValidationErrors = function() { return errors; }
  return this;
}

module.exports = function(options) {
  // Provide default values for most params
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

  // /api/run — Validation Runner
  this.run = (function(data, schema) {
    if(!data)
      throw new Error('You need to provide data file to validate');

    return new Promise((function(RS, RJ) {
      request[this.options.method](API_URL + 'run')
        // Provide request data with .query() in case of GET, otherwise use .send()
        [this.options.method == 'get' ? 'query' : 'send'](_.extend(_.omit(this.options, 'method'), {data: data, schema: schema || {}}))

        .end(function(E, R) {
          if(E)
            RJ('API request failed: ' + E);

          RS(new ValidationReport(JSON.parse(R.text).report));
        });
    }).bind(this));
  }).bind(this);

  return this;
}