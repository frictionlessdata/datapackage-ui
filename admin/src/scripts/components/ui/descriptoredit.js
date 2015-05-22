var backbone = require('backbone');
var jsonEditor = require('json-editor');


module.exports = {
  DescriptorEditView: backbone.BaseView.extend({
    render: function() {
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

    delegateEvents: function() {
      if(window.APP.layout.registryList) window.APP.layout.registryList.on('change', function(event) {
        var
          selected = window.APP.layout.registryList.getSelected();

        this.schema = {$ref: selected.get('schema')};
        this.render();
      }, this);

      backbone.BaseView.prototype.delegateEvents.apply(this, arguments);
      return this;
    },

    undelegateEvents: function() {
      if(window.APP.layout.registryList) window.APP.layout.registryList.off(null, null, this);
    }
  })
};