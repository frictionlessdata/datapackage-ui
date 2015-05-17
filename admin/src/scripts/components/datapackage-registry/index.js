var request = require('superagent');
var csv = require('csv');

var config = {
  backend: 'https://rawgit.com/dataprotocols/registry/master/registry.csv',
  objectwise: true
};


function getCSVEndpoint(endpoint, objectwise) {

  /**
   * Return data from an endpoint that is parsable as CSV
   */

  request
    .get(endpoint)
    .end(function(error, response) {

      csv.parse(response.text, {columns: objectwise}, function(error, output) {

        // Just here for example. Can remove when ready.
        console.log('Got data from the Data Package Registry endpoint: ');
        console.log(output);

      });
    });
}


function getRegistry() {

  /**
   * Return the DataPackage Registry as an array of objects
   */

  return getCSVEndpoint(config.backend, config.objectwise);

}


module.exports = {
    get: getRegistry
};
