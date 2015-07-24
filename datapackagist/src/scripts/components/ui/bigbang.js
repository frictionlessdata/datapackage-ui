var backbone = require('backbone');
var backboneBase = require('backbone-base');
var descriptorEdit = require('./descriptoredit');
var dialog = require('./dialog');
var DownloadView = require('./download');
var navigation = require('./navigation');
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
    this.layout.notificationDialog = new dialog.NotificationView({el: window.APP.$('#notification-dialog')});
    (this.layout.descriptorEdit = new descriptorEdit.DescriptorEditView({el: window.APP.$('#descriptor')})).render();
    this.layout.download = new DownloadView({el: window.APP.$('#download-data-package')});
    this.layout.navbar = new navigation.NavbarView({el: window.APP.$('#navbar')});

    this.layout.validationResultList = (new validationResult.ValidationResultsView({
      el: window.APP.$('#validation-result')
    })).render();

    return this;
  }
});
