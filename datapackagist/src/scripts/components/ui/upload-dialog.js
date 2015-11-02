require('fileapi');

var _ = require('underscore');
var backbone = require('backbone');
var dialogs = require('./dialog');
var validator = require('validator');
var uploadTpl = require('./templates/upload-dialog.hbs');

var CSV = require('./csv-resource');

var updateUI = function(fileNameOrUrl) {
  var noSelection = $('#step1-no-file-selected');
  var currentSelection = $('#step1-selected-file');
  if (fileNameOrUrl) {
    noSelection.hide();
    currentSelection.show().find('span').text(fileNameOrUrl);
  } else {
    noSelection.show();
    currentSelection.hide().find('span').empty();
  }
};

// Unified file/URL upload dialog
module.exports = dialogs.BaseModalView.extend({
  activate: function(state) {
    dialogs.BaseModalView.prototype.activate.call(this, state);
    this.activateError(false);

    if(state !== false)
      this.$('[data-id=file-input], [data-id=url-input]').val('');

    return this;
  },

  activateError: function(state) {
    var hasError = _.isUndefined(state) || state;


    this.$('[data-id="url-form-row"]').toggleClass('has-error', hasError);
    this.$('[data-id="url-error"]').prop('hidden', !hasError);
  },

  events: _.extend(_.clone(dialogs.BaseModalView.prototype.events), {
    'click [data-id="upload-local"]': function(E) {
      this.$('[data-id=file-input]').trigger('click');
    },
    'click [data-id="upload-url"]': 'uploadURL',

    'keyup [data-id="url-input"]': function(E) {
      if(E.keyCode === 13)
        this.uploadURL();
    },

    'change [data-id="file-input"]': function(E) {
      window.APP.layout.uploadDialog.deactivate();
      window.APP.layout.splashScreen.activate();

      this.callbacks.processLocalFile(
          FileAPI.getFiles(E.currentTarget)[0]
      ).finally(
          function(){
            updateUI(FileAPI.getFiles(E.currentTarget)[0]);
            window.APP.layout.splashScreen.activate(false);
          }
      );
    }
  }),

  render: function() {
    this.$el.html(this.template());
    return this;
  },
  setTitle: function(title) {
    this.$('[data-id=title]').html(title);
    return this;
  },
  setMessage: function(message) {
    this.$('[data-id=message]').html(message);
    return this;
  },
  setProgress: function(percents) {
    return this;
  },
  template: uploadTpl,

  uploadURL: function() {
    this.activateError(false);

    var url = this.$('[data-id=url-input]').val();
    if(!validator.isURL(url)) {
      this.activateError();
      return this;
    }
    window.APP.layout.uploadDialog.deactivate();
    window.APP.layout.splashScreen.activate();

    this.callbacks.processURL(url).finally(
        function(){
          updateUI(url);
          window.APP.layout.splashScreen.activate(false);
        }
    );
  }
});
