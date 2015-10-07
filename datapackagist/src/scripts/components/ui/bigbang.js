var backbone = require('backbone');
var backboneBase = require('backbone-base');
var descriptorEdit = require('./descriptoredit');
var dialog = require('./dialog');
var DownloadView = require('./download');
var navigation = require('./navigation');
var registry = require('./registry');
var validationResult = require('./validationresult');
var UploadView = require('./upload');


module.exports = backbone.BaseView.extend({
  events: {
    'click #upload-data-package': function() {
      this.layout.uploadDialog.activate();
      return false;
    }
  },

  initialize: function(options) {
    backbone.BaseView.prototype.initialize.call(this, options);

    // Detect browser just once, during init
    this.browser = require('detect-browser');
  },

  render: function() {
    this.layout.confirmationDialog = new dialog.ConfirmationView({el: window.APP.$('#confirmation-dialog')});
    this.layout.splashScreen = new dialog.SplashView({el: window.APP.$('#loading')});
    this.layout.notificationDialog = new dialog.NotificationView({el: window.APP.$('#notification-dialog')});
    (this.layout.descriptorEdit = new descriptorEdit.DescriptorEditView({el: window.APP.$('#descriptor')})).render();
    this.layout.download = new DownloadView({el: window.APP.$('#download-data-package')});
    this.layout.navbar = new navigation.NavbarView({el: window.APP.$('#navbar')});

    this.layout.validationResultList = (new validationResult.ValidationResultsView({
      el: window.APP.$('#validation-result')
    })).render();

    this.layout.uploadDialog = (new UploadView({el: window.APP.$('#upload-dialog'), parent: this})).render();
    return this;
  }
});
