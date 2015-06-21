var _ = require('underscore');
var backbone = require('backbone');
var registry = require('datapackage-registry');

// WARN Used just for demo purposes
var VALID_DESCRIPTOR = {
  'name': 'my-dataset',
  
  'resources': [{
    'path': 'data.csv',

    'schema': {
      'fields': [
        {'name': 'var1', 'type': 'string'},
        {'name': 'var2', 'type': 'integer'},
        {'name': 'var3', 'type': 'number'}
      ]
    }
  }]
};


// Application state changed here
module.exports = backbone.Router.extend({
  routes: {
    '(/)': 'index',
    'validation-results/:resource(/)': 'validationResults'
  },

  /**
   * Turn off all UI views except navigation bar which is part of base layout
   */
  deactivateAll: function() {
    _.chain(_.omit(window.APP.layout, ['navbar']))
      .values()
      .invoke('deactivate');

    return this;
  },

  index: function() {
    this.deactivateAll();
    window.APP.layout.navbar.toggleBadge(true);
    window.APP.layout.download.activate();
    window.APP.layout.descriptorEdit.activate();
    window.APP.layout.descriptorEdit.layout.registryList.activate();
    window.APP.layout.errorList.activate();

    // WARN Process registry errors here
    if(!window.APP.layout.descriptorEdit.layout.registryList.collection) registry.get().then(function(D) {
      window.APP.layout.descriptorEdit.layout.registryList
        .reset(new backbone.Collection(D));
    });
  },

  validationResults: function(resource) {
    this.deactivateAll();
    window.APP.layout.navbar.toggleBadge(true);

    window.APP.layout.validationResultList
      .activate()
      .setActive(resource);
  }
});