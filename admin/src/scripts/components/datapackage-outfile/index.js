var _ = require('underscore');


/**
 * Get datapackage descriptor and return object that will be used to describe 
 * json file for download.
 */
module.exports = function(descriptor, options) {
  if (_.isEmpty(descriptor) || !_.isObject(descriptor))
    throw new Error('Non-empty descriptor object should be passed');

  return (options || {}).IE9 ? 'data:text/plain,' : 'data:application/json,';
};
