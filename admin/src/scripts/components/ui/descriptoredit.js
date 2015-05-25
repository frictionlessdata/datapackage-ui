var backbone = require('backbone');
var backboneBase = require('backbone-base');
var jsonEditor = require('json-editor');
var UploadView = require('./upload');


module.exports = {
  DescriptorEditView: backbone.BaseView.extend({
    activate: function(state) {
      backbone.BaseView.prototype.activate.call(this, state);
      this.layout.upload.activate(state);
      return this;
    },

    // WARN Need implementation
    // Return true if form has any input
    hasChanges: function() { return true; },

    render: function() {
      this.layout.upload = new UploadView({el: window.APP.$('#upload-data-package'), parent: this});

      // JSON editor can not be created without json schema
      if(!this.schema)
        return this;

      // If editor already exists destroy if
      if(this.layout.form)
        this.layout.form.destroy();

      this.layout.form = new JSONEditor(this.el, {
        ajax: true,
        schema: this.schema,
        theme: 'bootstrap3'
      });

      return this;
    },

    reset: function(url) {
      this.schema = {$ref: url};
      return this;
    }
  })
};