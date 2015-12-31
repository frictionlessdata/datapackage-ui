var config = require('../../config');
require('fileapi');
var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');
var validator = require('datapackage-validate');
var request = require('superagent-bluebird-promise');
var Promise = require('bluebird');

// Upload datapackage
module.exports = backbone.BaseView.extend({
  updateUI: function (fileNameOrUrl) {
    var noSelection = $('#step1-no-file-selected');
    var currentSelection = $('#step1-selected-file');
    if (fileNameOrUrl) {
      noSelection.hide();
      currentSelection.show().find('span').text(fileNameOrUrl);
    }
  },

  // Update edit form and download URL
  updateApp: function(descriptor) {
    var descriptorEdit = window.APP.layout.descriptorEdit;
    descriptorEdit.layout.form.setValue(
        _.defaults(descriptor, descriptorEdit.layout.form.getValue())
    );
    return this;
  },

  processJSONData: function(data) {
    var that = this;
    return (new Promise( (function (resolve, reject) {
        var descriptor;
        var descriptorEdit;

        try {
          descriptor = JSON.parse(data);
        } catch(E) { }
        descriptorEdit = window.APP.layout.descriptorEdit;

        // If descriptor is broken or If descriptor have field not from schema - reject it
        if( !_.isObject(descriptor) ) {
          window.APP.layout.notificationDialog.setMessage('JSON is invalid').activate();
          resolve(false);
          return;
        }

        // If there are no changes in current form just apply uploaded
        // data and leave
        if(!descriptorEdit.hasChanges()) {
          that.updateApp(descriptor);
          resolve(true);
          return true;
        }

        // Ask to overwrite changes on current form
        window.APP.layout.confirmationDialog
          .setMessage('You have changes. Overwrite?')
          .setCallbacks(
          {
            yes: (function() {
              that.updateApp(descriptor);
              resolve(true);
              return;
            }).bind(this),
            no: (function() {
              resolve(false);
              return;
            }).bind(this)

          }
        ).activate();
      }).bind(this))
    );
  },

  events: {
    'click': function() {
      window.APP.layout.uploadDialog.setMessage(
          'Select data package JSON file from your local drive or enter URL ' +
          'to download from.'
      ).setCallbacks({
            processLocalFile: (
                function(file) {
                  var that = this;

                  return new Promise((function (resolve, reject) {
                    try {
                      FileAPI.readAsText(
                          file,
                          (function (fileInfo) {
                            if(fileInfo.type === 'load') {
                              this.processJSONData(fileInfo.result).then(function(status){
                                if (status){
                                  that.updateUI(file.name);
                                }
                                resolve(status);
                              });
                            }
                          }).bind(this)
                      );
                    } catch (e) {
                      console.log(e);
                    }
                  }).bind(this));
                }
            ).bind(this),
            processURL: (
                function(url) {
                  var that = this;
                  return new Promise((function (resolve, reject) {
                      request.get(config.corsProxyURL(url)).then(
                          (function(res) {
                            this.processJSONData(res.text).then(function(status){
                              if (status){
                                that.updateUI(url);
                              }
                              resolve(status);
                            });
                        }).bind(this)
                      );
                  }).bind(this));
                }
            ).bind(this)
          }
      ).activate();

      return false;
    }
  }
});