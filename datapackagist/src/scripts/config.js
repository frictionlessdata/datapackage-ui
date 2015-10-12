var _ = require('underscore');


try {
  var localConfig = require('./config-local');
} catch(E) {
  var localConfig = {};
}


module.exports = _.extend({
  corsProxyURL: function(url) { return module.exports.host + '/cors-proxy/' + url; },
  host: 'http://datapackagist.herokuapp.com',

  // How many rows of CSV to process when parsing it into object and infering schema
  maxCSVRows: 100
}, localConfig);
