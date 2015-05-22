var backbone = require('backbone');
var jsonEditor = require('json-editor');
var registry = require('./registry');
var _ = require('underscore');


module.exports = {
  DescriptorEditView: backbone.BaseView.extend({
    render: function() {
      this.layout.registryList = new registry.ListView({el: window.APP.$('#registry-list'), parent: this});

      return this;
    },

    reset: function(schema) {
      var formData;

      // If editor already exists destroy it
      if(this.layout.form) {
        formData = this.layout.form.getValue();
        this.layout.form = this.layout.form.destroy();
      }

      // JSON editor can not be created without json schema
      if(schema && schema.$ref)
        this.layout.form = new JSONEditor(this.el, {
          ajax: true,
          schema: schema,
          theme: 'bootstrap3'
        });
    }
  })
};