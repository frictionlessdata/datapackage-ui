require('fileapi');

var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');
var validator = require('datapackage-validate');


// Upload datapackage
module.exports = backbone.BaseView.extend({
  events: {
    'change [data-id=input]': function(E) {
      FileAPI.readAsText(FileAPI.getFiles(E.currentTarget)[0], (function (EV) {
        var descriptor;


        if(EV.type === 'load') {
          // Validate datapackage and apply to the form
          validator.validate(EV.result, window.APP.layout.descriptorEdit.layout.registryList.getSchema()).then((function(R) {
            if(!R.valid)
              return false;


            descriptor = JSON.parse(EV.result);

            // If descriptor have field not from schema - reject it
            if(_.difference(_.keys(descriptor), _.keys(this.parent.layout.form.schema.properties)).length)
              return false;

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
          }).bind(this));
        } else if( EV.type ==='progress' )
          this.setProgress(EV.loaded/EV.total * 100);

      }).bind(this));
    }
  },

  setProgress: function(percents) { return this; },

  // Update edit form and download URL
  updateApp: function(descriptor) {
    this.parent.layout.form.setValue(_.defaults(descriptor, this.parent.layout.form.getValue()));
    return this;
  }
});
