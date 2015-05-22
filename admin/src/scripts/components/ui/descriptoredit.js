var backbone = require('backbone');
var jsonEditor = require('json-editor');


module.exports = {
  DescriptorEditView: backbone.BaseView.extend({
    render: function() {
      // JSON editor can not be created without json schema
      if(this.schema) {
        // If editor already exists destroy if
        if(this.layout.form)
          this.layout.form.destroy();

        this.layout.form = new JSONEditor(this.el, {
          ajax: true,
          schema: this.schema,
          theme: 'bootstrap3'
        });
      }

      return this;
    },

    reset: function(url) {
      this.schema = {$ref: url};
      return this;
    }
  })
};