var backbone = require('backbone');


module.exports = backbone.Router.extend({
  routes: {
    '(/)': 'index'
  },

  index: function() {
    console.log('Router works!');
    window.APP.layout.navbar.toggleBadge(true);
  }
});