var backbone = require('backbone');
var jsonEditor = require('json-editor');
var registry = require('./registry');


module.exports = {
  DescriptorEditView: backbone.BaseView.extend({
    render: function() {
      if( ! this.layout.registryList) this.layout.registryList = new registry.ListView({el: window.APP.$('#registry-list'), parent: this});

      // If editor already exists destroy it
      if(this.layout.form)
        this.layout.form = this.layout.form.destroy();

      // JSON editor can not be created without json schema
      if(this.schema && this.schema.$ref)
        this.layout.form = new JSONEditor(this.el, {
          ajax: true,
          schema: this.schema,
          theme: 'bootstrap3'
        });

      return this;
    }
  })
};