var backbone = require('backbone');
var registry = require('./components/datapackage-registry');


module.exports = backbone.Router.extend({
  routes: {
    '(/)': 'index'
  },

  index: function() {
    window.APP.layout.navbar.toggleBadge(true);

    window.APP.layout.registryList
      .reset(new backbone.Collection([{id: 1}]))
      .activate();
  }
});