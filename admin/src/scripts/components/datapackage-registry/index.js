var Promise = require('promise-polyfill');
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

  return new Promise(function(resolve, reject) {

    request
      .get(endpoint)
      .end(function(error, response) {

        if (error)
          reject('Failed to download registry file: ' + error);

        csv.parse(response.text, {columns: objectwise}, function(error, output) {

          if (error)
            reject('Failed to parse registry file: ' + error);

          resolve(output);

        });
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
