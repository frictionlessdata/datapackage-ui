var backbone = require('backbone');
var backboneBase = require('backbone-base');


module.exports = backbone.BaseView.extend({
  toggleBadge: function(state) {
    this.$('[data-id=badge]').toggleClass('collapsed', state);
    return this;
  }
});
