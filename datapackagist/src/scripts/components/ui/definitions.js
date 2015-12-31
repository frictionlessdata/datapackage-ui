/**
 * Created by Ihor Borysyuk on 29.12.15.
 */
var _ = require('underscore');

function getDefinitionObj(ref, definitions) {
  var result = {};
  var tempDeepString = ref.split('#/').pop(); // definitions.json#/define/homepage => define/homepage
  var deepProperties = tempDeepString.split('/'); // define/homepage => ['define', 'homepage']
  if (deepProperties.length) {
    result = definitions;
    for (var i=0; i<deepProperties.length; i++) {
      result = result[deepProperties[i]];
    }
  }
  return result;
}

function findAllRefValues(schema) {
  var result = [];
  _.forEach(schema, function(value, key) {
    if (_.isObject(value)) {
      result = _.union(result, findAllRefValues(value));
    } else {
      if (key == '$ref') {
        result.push(value);
      }
    }
  });
  return _.uniq(result);
}

function getRefsMapping(schema, definitions) {
  var result = {};
  var refs = findAllRefValues(schema);
  _.forEach(refs, function(ref){
    result[ref] = JSON.parse(JSON.stringify(getDefinitionObj(ref, definitions)));
  });
  return result;
}

module.exports = getRefsMapping;