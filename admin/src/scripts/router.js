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
    window.APP.layout.jsonForm
                        .reset('https://raw.githubusercontent.com/dataprotocols/schemas/master/data-package.json')
                        .render()
                        .activate();
  }
});