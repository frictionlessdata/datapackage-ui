require('fileapi');

var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');
var dialogs = require('./dialog');
var validator = require('datapackage-validate');
var uploadTpl = require('./templates/upload-dialog.hbs');


// Unified file/URL upload dialog
module.exports = dialogs.BaseModalView.extend({
  events: _.extend(_.clone(dialogs.BaseModalView.prototype.events), {
    'click [data-id="upload-local"]': function(E) { this.$('[data-id=file-input]').trigger('click'); },

    'change [data-id="file-input"]': function(E) {
      window.APP.layout.uploadDialog.deactivate();
      window.APP.layout.splashScreen.activate();

      FileAPI.readAsText(FileAPI.getFiles(E.currentTarget)[0], (function (EV) {
        if(EV.type === 'load')
          this.callbacks.local(EV.target.name, EV.result);
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
