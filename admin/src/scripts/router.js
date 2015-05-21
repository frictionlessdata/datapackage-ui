var _ = require('underscore');
var backbone = require('backbone');
var registry = require('./components/datapackage-registry');

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
    '(/)': 'index'
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

    // WARN Process registry errors here
    registry.get().then(function(D) {
      window.APP.layout.registryList
        .reset(new backbone.Collection(D))
        .activate();
    });

    // WARN Use real descriptor here
    // Update download link with current descriptor
    window.APP.download.reset(VALID_DESCRIPTOR).activate();
  }
});