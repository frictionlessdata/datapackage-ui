var _ = require('underscore');


/**
 * Get datapackage descriptor and return string that will be used to describe 
 * json file for download.
 */
module.exports = function(descriptor, options) {
  if (_.isEmpty(descriptor) || !_.isObject(descriptor))
    throw new Error('Non-empty descriptor object should be passed');

  return [
    'data',
    _.result(options, 'IE9') ? 'text/plain' : 'application/json',
    _.result(options, 'charset') || 'utf-8'
  ].join(':') + ',' + JSON.stringify(descriptor);
};
