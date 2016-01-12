var _ = require('underscore');


module.exports = {
  corsProxyURL: function(url) { return module.exports.proxy.replace('{url}', encodeURIComponent(url))},
//  proxy: 'http://datapackagist.herokuapp.com/cors-proxy/{url}',
  proxy: 'http://gobetween.oklabs.org/pipe/{url}',

  // How many rows of CSV to process when parsing it into object and infering schema
  maxCSVRows: 1000
};
