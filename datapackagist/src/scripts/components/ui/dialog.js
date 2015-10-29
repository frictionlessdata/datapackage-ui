var _ = require('underscore');
var backbone = require('backbone');

var BaseView = backbone.BaseView.extend({
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
    this.$el.modal({show: false}).on('hidden.bs.modal', function() {
      this.undelegateEvents();
    });
    return this;
  },

  events: {
    // Hide dialog when user clicks on overlay
    'click': function(event) {
      if(!$(event.target).closest('[data-id=dialog]').length)
        this.deactivate();
    },

    'click [data-id=close]': 'deactivate'
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
    events: {
      'click [data-id=ok]': function () {
        // Just close dialog as default No-action
        this.deactivate();

        return false;
      }}
  }),

  ConfirmationView: BaseView.extend({
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
