require('fileapi');

var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');
var validator = require('datapackage-validate');


// Upload datapackage
module.exports = backbone.BaseView.extend({
  events: {
    'change [data-id=input]': function(E) {
      window.APP.layout.errorList.clear();

      FileAPI.readAsText(FileAPI.getFiles(E.currentTarget)[0], (function (EV) {
        var descriptor;


        if(EV.type === 'load') {
          try {
            var
              validateResult = validator.validate(EV.result);

            if(!validateResult.valid) {
              window.APP.layout.errorList.reset(new backbone.Collection(validateResult.errors));
              return false;
            }

            descriptor = JSON.parse(EV.result);
          } catch(exception) {
            window.APP.layout.errorList.reset(new backbone.Collection([exception]));
            return false;
          }

          // If there are no changes in current form just apply uploaded
          // data and leave
          if(!this.parent.hasChanges()) {
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
        } else if( EV.type ==='progress' ){
          this.setProgress(EV.loaded/EV.total * 100);
        } else {
          window.APP.layout.errorList.reset(new backbone.Collection([{message: 'File upload failed'}]));
        }
      }).bind(this));
    }
  },

  setProgress: function(percents) { return this; },

  // Update edit form and download URL
  updateApp: function(descriptor) {
    this.parent.layout.form.setValue(descriptor);
    window.APP.layout.download.reset(descriptor).activate();
    return this;
  }
});
