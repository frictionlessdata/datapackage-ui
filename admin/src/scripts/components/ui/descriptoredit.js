var backbone = require('backbone');
var backboneBase = require('backbone-base');
var jsonEditor = require('json-editor');
var UploadView = require('./upload');
var registry = require('./registry');
var _ = require('underscore');


module.exports = {
  DescriptorEditView: backbone.BaseView.extend({
    activate: function(state) {
      backbone.BaseView.prototype.activate.call(this, state);
      this.layout.upload.activate(state);
      return this;
    },

    render: function() {
      this.layout.upload = new UploadView({el: window.APP.$('#upload-data-package'), parent: this});
      this.layout.registryList = new registry.ListView({el: window.APP.$('#registry-list'), parent: this});
      return this;
    },

    // Utility method to remove empty values from object recursive
    compactObject: function(data) {
      _.each(data, function(v, k) {
        if(_.isEmpty(v)) {
          delete data[k];
        } else if(_.isArray(v) || _.isObject(v)) {
          v = this.compactObject(v);

          if(_.isArray(v))
            v = _.compact(v);

          if(_.isEmpty(v))
            delete data[k];
          else data[k] = v;
        }
      }, this);
      return data;
    },

    getFilledValues: function() {
      return this.compactObject(this.layout.form.getValue());
    },

    getValue: function (){
      return this.layout.form.getValue();
    },

    hasChanges: function() { return Boolean(this.changed); },

    reset: function(schema) {
      var
        formData;

      if(this.layout.form) {
        formData = this.getFilledValues();
        this.layout.form.destroy();
      }

      this.layout.form = new JSONEditor(this.el, {
        schema: schema,
        theme: 'bootstrap3',
        no_additional_properties: true
      });

      this.layout.form.on('ready', (function() {
        // Detecting changes
        this.changed = false;

        // After `ready` event fired, editor fire `change` event regarding to the initial changes
        this.layout.form.on('change', _.after(2, (function() { this.changed = true; }).bind(this)));

        // If on the previous form was entered values try to apply it to new form
        if(formData) {
          this.layout.form.setValue(_.extend({}, this.layout.form.getValue(formData), formData));
        }

      }).bind(this));
    }
  })
};