module.exports = function(options) {
  this.options = options;

  this.run = function(data, schema) {
    if (!data)
      throw new Error('You need to provide data file to validate');

    return new Promise(function(RS, RJ) { RS(true); });
  }

  return this;
}