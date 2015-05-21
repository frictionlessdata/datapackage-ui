var _ = require('underscore');
var validator = require('datapackage-validate');


/**
 * Get datapackage descriptor and return object that will be used to describe 
 * json file for download.
 */
module.exports = function(descriptor, options) {
	var validation;


  if (_.isEmpty(descriptor) || !_.isObject(descriptor))
    throw new Error('Non-empty descriptor object should be passed');

  validation = validator.validate(descriptor);

  if (!validation.valid)
    throw new Error(
    	'Descriptor is invalid and has following errors:\n\t' + _.map(validation.errors, function(E) {
    		return E.message + (E.line ? 'at ' + E.line : '')
    	}).join('\n\t')
    );

  return [
  	'data',
  	_.result(options, 'IE9') ? 'text/plain' : 'application/json',
  	_.result(options, 'charset') || 'utf-8'
  ].join(':') + ',' + JSON.stringify(descriptor);
};
