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

    events: {
      'click [data-id=yes]': function() {
        // Error should be thrown if no callback defined — there is no default action
        return this.callbacks.yes();
      },

      'click [data-id=no]': function() {
        if(_.isFunction((this.callbacks || {}).no))
          return this.callbacks.no();

        // Just close dialog as default No-action
        this.deactivate();

        return false;
      }
    },

    // Update internal object of callbacks called during Yes/No click
    setCallbacks: function(callbacks) {
      this.callbacks = _.extend(this.callbacks || {}, callbacks);
      return this;
    },

    setMessage: function(text) { this.$('[data-id=message]').html(text || ''); return this; }
  })
};
