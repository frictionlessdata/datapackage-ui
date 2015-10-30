var _ = require('underscore');
var backbone = require('backbone');

var BaseView = backbone.BaseView.extend({
  events: {},

  // Activate overlay along with dialog box
  activate: function(state) {
    var isActivation = state || _.isUndefined(state);

    this.undelegateEvents();

    if (isActivation) {
      this.$el.modal('show');
      this.delegateEvents(this.events);
    } else {
      this.$el.modal('hide');
    }
    return this;
  },

  setElement: function(element) {
    backbone.BaseView.prototype.setElement.apply(this, arguments);
    var self = this;
    this.$el.modal({show: false}).on('hidden.bs.modal', function() {
      self.undelegateEvents();
    });
    return this;
  },

  // Update internal object of callbacks called during Yes/No click
  setCallbacks: function(callbacks) {
    this.callbacks = _.extend(this.callbacks || {}, callbacks);
    return this;
  },

  setMessage: function(text) { this.$('[data-id=message]').html(text || ''); return this; }
});

module.exports = {
  BaseModalView: BaseView,

  SplashView: backbone.BaseView.extend({
    // Activate overlay and splash layout
    activate: BaseView.prototype.activate
  }),

  NotificationView: BaseView.extend({
    setTitle: function(title) {
      this.$('[data-id=title]').html(title);
      return this;
    },
    events: {
      'click [data-id=ok]': function () {
        // Just close dialog as default No-action
        this.deactivate();

        return false;
      }}
  }),

  ConfirmationView: BaseView.extend({
    setTitle: function(title) {
      this.$('[data-id=title]').html(title);
      return this;
    },
    events: {
      'click [data-id=yes]': function() {
        this.deactivate();

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
    }
  })
};
