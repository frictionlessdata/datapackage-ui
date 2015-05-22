var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');

module.exports = {
  ConfirmationView: backbone.BaseView.extend({
    // Activate overlay along with dialog box
    activate: function(state) {
      window.APP.$('#overlay').prop('hidden', !(_.isUndefined(state) || state));
      backbone.BaseView.prototype.activate.call(this, state);
      return this;
    },
  })
};
