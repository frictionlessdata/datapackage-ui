var _ = require('underscore');


module.exports = {
  corsProxyURL: function(url) { return module.exports.host + '/cors-proxy/' + url; },
  host: 'http://datapackagist.herokuapp.com',

  // How many rows of CSV to process when parsing it into object and infering schema
  maxCSVRows: 1000
};
