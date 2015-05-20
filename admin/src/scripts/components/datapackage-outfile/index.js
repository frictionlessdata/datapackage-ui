var _ = require('underscore');


/**
 * Get datapackage descriptor and return object that will be used to describe 
 * json file for download.
 */
module.exports = function(descriptor) {
  if (_.isEmpty(descriptor) || !_.isObject(descriptor))
    throw new Error('Non-empty descriptor object should be passed');

  return {}
};
