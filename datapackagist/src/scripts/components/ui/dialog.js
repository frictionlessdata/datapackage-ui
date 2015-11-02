var _ = require('underscore');
var backbone = require('backbone');

var BaseView = backbone.BaseView.extend({
  events: {},

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
    activate: function(state) {
      window.APP.$('#overlay').prop('hidden', !(_.isUndefined(state) || state));
      backbone.BaseView.prototype.activate.call(this, state);
      return this;
    }
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
      }
    },
    showValidationErrors: function(forceShow) {
      forceShow = !!forceShow || _.isUndefined(forceShow);

      var errors = window.APP.layout.descriptorEdit.collectValidationErrors();
      if ((errors.length == 0) && !forceShow) {
        return;
      }

      var messages = ['<p>The Data Package is currently invalid.</p>'];
      if (errors.length > 0) {
        messages.push('<p>The following errors have been reported.</p>');
        messages.push('<p>Fix them and try again.</p>');

        _.forEach(errors, function(error) {
          messages.push('<p class="text-danger">' +
          '<i class="glyphicon glyphicon-exclamation-sign"></i>&nbsp;' +
          '&nbsp;<b>' + error.title + '</b>: ' + error.message + '</p>');
        });
      }

      this
        .setTitle('The Data Package Descriptor is invalid')
        .setMessage(messages.join(''))
        .activate();
    }
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
