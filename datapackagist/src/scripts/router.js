var _ = require('underscore');
var backbone = require('backbone');
var dpFromRemote = require('datapackage-from-remote');
var registry = require('datapackage-registry');
var Promise = require('bluebird');

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
    '(/)'                            : 'index',
    ':profile(/)'                    : 'index',
    'from-remote/:profile(/)'        : 'fromRemote',
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

  fromRemote: function(profile) {
    var descriptorEdit = window.APP.layout.descriptorEdit;
    var options = _.object(window.location.search.replace('?', '').split('&').map(function(P) { return P.split('='); }));

    // If .index() have not yet downloaded registry it will return Promise. Otherwise
    // registry is loaded and .index() returns undefined.
    (this.index() || new Promise(function(RS, RJ) { RS(true); })).then(function() {
      try {
        dpFromRemote(unescape(options.url), _.extend(options, {datapackage: profile}))
          .then(function(D) {
            // Update registry and descriptor schema list and then set descriptor form value
            descriptorEdit.layout.registryList.setSelected(profile).then(function() {
              descriptorEdit.layout.form.setValue(D);
            });
          })

          .catch(function(E) { console.log('Error while processing data: ' + E); });
      } catch(E) {
        console.log('Error while loading data from remote: ' + E);
      }
    });
  },

  index: function(profile) {
    var registryList;


    this.deactivateAll();
    window.APP.layout.navbar.toggleBadge(true);
    window.APP.layout.download.activate();
    window.APP.layout.descriptorEdit.activate();
    window.APP.layout.descriptorEdit.layout.registryList.activate();
    window.APP.layout.errorList.activate();
    registryList = window.APP.layout.descriptorEdit.layout.registryList;

    // WARN Process registry errors here
    if(!registryList.collection)
      // fromRemote route need to wait for registry before getting datapackage from remote source
      return registry.get().then((function(D) {
        registryList.reset(new backbone.Collection(D));
        this.setRegistryProfile(profile);
      }).bind(this));

    this.setRegistryProfile(profile);
  },

  setRegistryProfile: function(profile) {
    var registryList = window.APP.layout.descriptorEdit.layout.registryList;


    // Apply default profile if ID is wrong
    registryList.setSelected(profile || 'base').catch(function() { registryList.setSelected('base'); });
  },

  validationResults: function(resource) {
    this.deactivateAll();
    window.APP.layout.navbar.toggleBadge(true);

    window.APP.layout.validationResultList
      .activate()
      .setActive(resource);
  }
});