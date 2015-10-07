var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');
var validator = require('datapackage-validate');


// Upload datapackage
module.exports = backbone.BaseView.extend({
  events: {
    'click': function() {
      window.APP.layout.uploadDialog
        .setMessage(
          'Select data package JSON file from your local drive or enter URL ' +
          'to download from.'
        )

        .setCallbacks({
          local: (function(name, data) {
            var descriptor;
            var descriptorEdit;
            

            window.APP.layout.splashScreen.activate(false);

            try {
              descriptor = JSON.parse(data);
            }
            catch(E) { }

            descriptorEdit = window.APP.layout.descriptorEdit;

            // If descriptor is broken or If descriptor have field not from schema - reject it
            if(
              !_.isObject(descriptor) ||

              _.difference(
                _.keys(descriptor),
                _.keys(descriptorEdit.layout.form.schema.properties)
              ).length
            ) {
              window.APP.layout.notificationDialog
                .setMessage('JSON is invalid')
                .activate();

              return false;
            }

            // If there are no changes in current form just apply uploaded
            // data and leave
            if(!descriptorEdit.hasChanges()) {
              this.updateApp(descriptor);
              return false;
            }

            // Ask to overwrite changes on current form
            window.APP.layout.confirmationDialog
              .setMessage('You have changes. Overwrite?')

              .setCallbacks({yes: (function() {
                this.updateApp(descriptor);
                return false;
              }).bind(this)})

              .activate();
          }).bind(this)
        })

        .activate();

      return false;
    }
  },

  // Update edit form and download URL
  updateApp: function(descriptor) {
    var descriptorEdit = window.APP.layout.descriptorEdit;


    descriptorEdit.layout.form.setValue(
      _.defaults(descriptor, descriptorEdit.layout.form.getValue())
    );

    return this;
  }
});