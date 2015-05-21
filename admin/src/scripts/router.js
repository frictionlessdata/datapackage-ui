var backbone = require('backbone');

module.exports = backbone.Router.extend({
  routes: {
    '(/)': 'descriptorEdit'
  },

  descriptorEdit: function() {
    window.APP.layout.descriptorEdit
                        .reset('https://raw.githubusercontent.com/dataprotocols/schemas/master/data-package.json')
                        .render()
                        .activate();
  }
});