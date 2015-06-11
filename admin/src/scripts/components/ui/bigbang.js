var backbone = require('backbone');
var backboneBase = require('backbone-base');
var descriptorEdit = require('./descriptoredit');
var dialog = require('./dialog');
var DownloadView = require('./download');
var error = require('./error');
var NavbarView = require('./navbar');
var registry = require('./registry');
var validationResult = require('./validationresult');


module.exports = backbone.BaseView.extend({
  initialize: function(options) {
    backbone.BaseView.prototype.initialize.call(this, options);

    // Detect browser just once, during init
    this.browser = require('detect-browser');
  },

  render: function() {
    this.layout.confirmationDialog = new dialog.ConfirmationView({el: window.APP.$('#confirmation-dialog')});
    (this.layout.descriptorEdit = new descriptorEdit.DescriptorEditView({el: window.APP.$('#descriptor')})).render();
    this.layout.errorList = new error.ListView({el: window.APP.$('#error-list')});
    this.layout.download = new DownloadView({el: window.APP.$('#download-data-package')});
    this.layout.navbar = new NavbarView({el: window.APP.$('#navbar')});
    this.layout.registryList = new registry.ListView({el: window.APP.$('#registry-list'), container: '[data-id=list-container]'});
    this.layout.validationResultList = new validationResult.ListView({el: window.APP.$('#validation-result'), container: '[data-id=list-container]'});
    return this;
  }
});
