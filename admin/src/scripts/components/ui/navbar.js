var backbone = require('backbone');
var backboneBase = require('backbone-base');


module.exports = backbone.BaseView.extend({
  events: {
    'click [data-id=badge]': function() {
      this.toggleBadge();
      return false;
    }
  },

  toggleBadge: function(state) {
    this.$('[data-id=badge]').toggleClass('collapsed', state);
    return this;
  }
});
