var backbone = require('backbone');
var backboneBase = require('backbone-base');
var jsonEditor = require('json-editor');
var highlight = require('highlight-redux');
var UploadView = require('./upload');
var registry = require('./registry');
var _ = require('underscore');
var $ = require('jquery');


module.exports = {
  DescriptorEditView: backbone.BaseView.extend({
    activate: function(state) {
      backbone.BaseView.prototype.activate.call(this, state);
      this.layout.upload.activate(state);
      return this;
    },

    events: {
      'click [data-id=upload-data-file]': function() {
        console.log('Upload file');
      }
    },

    initialize: function() {
      highlight.configure({useBR: true});
      return backbone.BaseView.prototype.initialize.apply(this, arguments);
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

    getFilledValues: function() { return this.compactObject(this.layout.form.getValue()); },
    getValue: function () { return this.layout.form.getValue(); },
    hasChanges: function() { return Boolean(this.changed); },

    reset: function(schema) {
      var formData;

      if(this.layout.form) {
        formData = this.getFilledValues();
        this.layout.form.destroy();
      }

      this.layout.form = new JSONEditor(this.el, {
        schema: schema,
        theme: 'bootstrap3'
      });

      this.layout.form.on('ready', (function() {
        // There is no any good way to bind events to custom button or even add cutsom button
        $(this.layout.form.getEditor('root.resources').container)
          .children('h3')
            .append(
              $(this.layout.form.theme.getHeaderButtonHolder()).html(
                $(this.layout.form.theme.getButton('Upload data file', '', 'Upload data file')).attr('data-id', 'upload-data-file')
              )
            );

        // Detecting changes
        this.changed = false;

        // After `ready` event fired, editor fire `change` event regarding to the initial changes
        this.layout.form.on('change', _.after(2, (function() {
          this.changed = true;
          window.APP.layout.download.reset(this.layout.form.getValue()).activate();
          this.showResult();
        }).bind(this)));

        // If on the previous form was entered values try to apply it to new form
        if(formData)
          this.layout.form.setValue(_.extend({}, this.layout.form.getValue(formData), formData));
      }).bind(this));
    },

    showResult: function() {
      $('#json-code').html(highlight.fixMarkup(
        highlight.highlight('json', JSON.stringify(this.layout.form.getValue(), undefined, 2)).value
      ));

      return this;
    }
  })
};