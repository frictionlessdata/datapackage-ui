require('fileapi');

var backbone = require('backbone');
var backboneBase = require('backbone-base');
var getUri = require('get-uri');
var Goodtables = require('goodtables');
var jsonEditor = require('json-editor');
var jtsInfer = require('jts-infer');
var highlight = require('highlight-redux');
var UploadView = require('./upload');
var registry = require('./registry');
var _ = require('underscore');
var $ = require('jquery');


// Upload data file and populate .resource array with item
DataUploadView = backbone.BaseView.extend({
  events: {
    // Set up and append .resources row
    'change [data-id=input]': function(E) {
      FileAPI.readAsText(FileAPI.getFiles(E.currentTarget)[0], (function (EV) {
        if(EV.type === 'load') {
          getUri(['data', EV.target.type, 'utf-8'].join(':') + ',' + EV.result, (function (E, R) {
            if(E) throw E;

            jtsInfer(R, (function(E, S, SR) {
              if(E) throw E;

              this.options.form.getEditor('root.resources').addRow({
                name: EV.target.name,
                path: EV.target.name,
                schema: S
              });

              // Save data source
              _.last(this.options.form.getEditor('root.resources').rows).dataSource = EV.result;
            }).bind(this));
          }).bind(this));
        } else if( EV.type ==='progress' ) {
          this.setProgress(EV.loaded/EV.total * 100);
        } else {
          this.setError('File upload failed');
        }

        this.$(E.currentTarget).val('');
      }).bind(this));
    },

    'click [data-id=upload-data-file]': function() { this.$('[data-id=input]').trigger('click'); }
  },

  render: function() {
    this.$el
      .append('<input data-id="input" type="file" accept="text/csv" style="display: none;">')

      .append(
        $(this.options.form.theme.getButton('Upload data file', '', 'Upload data file'))
          .attr('data-id', 'upload-data-file')
      );

    return this;
  },

  setError: function() { return this; },
  setProgress: function() { return this; }
});

module.exports = {
  DescriptorEditView: backbone.BaseView.extend({
    activate: function(state) {
      backbone.BaseView.prototype.activate.call(this, state);
      this.layout.upload.activate(state);
      return this;
    },

    events: {
      'click #validate-resources': function() {
        var
          goodTables = new Goodtables({method: 'post'});

        window.APP.layout.validationResultList.reset(new backbone.Collection());

        _.each(this.layout.form.getEditor('root.resources').rows, function(R) {
          // Goodtables schema format {fields: [{name:'colname'...},...]}
          // Example https://raw.githubusercontent.com/okfn/goodtables/master/examples/test_schema.json
          goodTables.run(R.dataSource, JSON.stringify({fields: _.map(R.schema.properties, function(V, K) {
              return _.extend(V, {name: K}) })}
          )).then(
            function(M) {
              // Validation completed
              window.APP.layout.validationResultList.collection
                .add(
                  M.isValid()
                    ? [{resource_id: R.key, result_message: 'Validation Success'}]
                    : M.getValidationErrors().map(function(E) { return _.extend(E, {resource_id: R.key}) })
                );

              // Navigate between resources in validation results
              window.APP.layout.validationResultList.layout.tabs.add(new backbone.Model({
                title: R.getValue().path,

                // .key is a unique property among all resources rows
                url: '/validation-results/' + R.key
              }));

              window.ROUTER.navigate('/validation-results/' + R.key, {trigger: true});
            }
          );
        });
      }
    },

    initialize: function(options) {
      highlight.configure({useBR: true});
      return backbone.BaseView.prototype.initialize.call(this, options);
    },

    render: function() {
      this.layout.upload = new UploadView({el: window.APP.$('#upload-data-package'), parent: this});
      this.layout.registryList = new registry.ListView({el: window.APP.$('#registry-list'), container: '[data-id=list-container]', parent: this});
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

      // Clean up previous state
      if(this.layout.form) {
        formData = this.getFilledValues();
        this.layout.form.destroy();
        this.layout.uploadData.undelegateEvents().remove();
      }

      this.layout.form = new JSONEditor(this.$('[data-id=form-container]').get(0), {
        schema: schema,
        theme: 'bootstrap3'
      });

      this.layout.uploadData = (new DataUploadView({
        el: this.layout.form.theme.getHeaderButtonHolder(),
        form: this.layout.form,
        parent: this
      })).render();

      this.layout.form.on('ready', (function() {
        // There is no any good way to bind events to custom button or even add cutsom button
        $(this.layout.form.getEditor('root.resources').container)
          .children('h3').append(this.layout.uploadData.el);

        // Detecting changes
        this.changed = false;

        // After `ready` event fired, editor fire `change` event regarding to the initial changes
        this.layout.form.on('change', _.after(2, (function() {
          this.changed = true;
          window.APP.layout.download.reset(this.layout.form.getValue()).activate();
          this.showResult();
        }).bind(this)));

        // If on the previous form was entered values try to apply it to new form
        if(formData) {
          this.layout.form.setValue(_.extend({}, this.layout.form.getValue(formData), formData));

          // Expand editors if it have value
          _.each(this.$('[data-schemapath][data-schemapath!=root]:has(.json-editor-btn-collapse)'), function(E) {
              if(_.isEmpty(this.layout.form.getEditor($(E).data('schemapath')).getValue()))
                $(E).find('.json-editor-btn-collapse').click();
          }, this);
        } else
          // Collapse all
          this.$('.row .json-editor-btn-collapse').click();

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
