var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');
var validator = require('datapackage-validate');


// Upload datapackage
module.exports = backbone.BaseView.extend({
  events: {
    'click': function() {
      window.APP.layout.uploadDialog.setMessage(
        'Select data package JSON file from your local drive or enter URL ' +
        'to download from.'
      ).activate();

      return false;
    }
  },

  // Update edit form and download URL
  updateApp: function(descriptor) {
    this.parent.layout.form.setValue(_.defaults(descriptor, this.parent.layout.form.getValue()));
    return this;
  }
});