require('fileapi');

var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');
var dialogs = require('./dialog');
var request = require('superagent-bluebird-promise');
var validator = require('validator');
var uploadTpl = require('./templates/upload-dialog.hbs');


// Unified file/URL upload dialog
module.exports = dialogs.BaseModalView.extend({
  activate: function(state) {
    dialogs.BaseModalView.prototype.activate.call(this, state);
    this.activateError(false);
    return this;
  },

  activateError: function(state) {
    var hasError = _.isUndefined(state) || state;


    this.$('[data-id="url-form-row"]').toggleClass('has-error', hasError);
    this.$('[data-id="url-error"]').prop('hidden', !hasError);
  },

  events: _.extend(_.clone(dialogs.BaseModalView.prototype.events), {
    'click [data-id="upload-local"]': function(E) { this.$('[data-id=file-input]').trigger('click'); },

    'click [data-id="upload-url"]': function(E) {
      var url = this.$('[data-id=url-input]').val();


      this.activateError(false);

      if(!validator.isURL(url)) {
        this.activateError();
        return this;
      }

      window.APP.layout.uploadDialog.deactivate();
      window.APP.layout.splashScreen.activate();

      request.get(url).then((function(RES) {
        window.APP.layout.splashScreen.deactivate();
        this.callbacks.data(url, RES.text);
      }).bind(this));
    },

    'change [data-id="file-input"]': function(E) {
      window.APP.layout.uploadDialog.deactivate();
      window.APP.layout.splashScreen.activate();

      FileAPI.readAsText(FileAPI.getFiles(E.currentTarget)[0], (function (EV) {
        if(EV.type === 'load')
          this.callbacks.data(EV.target.name, EV.result);
        else if(EV.type ==='progress')
          this.setProgress(EV.loaded/EV.total * 100);
      }).bind(this));
    }
  }),

  render: function() { this.$el.html(this.template()); return this; },
  setMessage: function(message) { this.$('[data-id=message]').html(message); return this; },
  setProgress: function(percents) { return this; },
  template: uploadTpl
});
