var backbone = require('backbone');

module.exports = backbone.Router.extend({
  routes: {
    '(/)': 'index',
    'json-form(/)': 'jsonForm'
  },

  index: function() {
    console.log('Router works!');
    window.APP.layout.navbar.toggleBadge(true);
  },

  jsonForm: function() {
    window.APP.layout.jsonForm.activate();
  }
});