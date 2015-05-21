var backbone = require('backbone');

module.exports = backbone.Router.extend({
  routes: {
    '(/)': 'index',
    'descriptor-edit(/)': 'descriptorEdit'
  },

  index: function() {
    console.log('Router works!');
    window.APP.layout.navbar.toggleBadge(true);
  },

  descriptorEdit: function() {
    window.APP.layout.descriptorEdit
                        .reset('https://raw.githubusercontent.com/dataprotocols/schemas/master/data-package.json')
                        .render()
                        .activate();
  }
});