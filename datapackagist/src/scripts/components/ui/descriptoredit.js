require('fileapi');

var backbone = require('backbone');
var backboneBase = require('backbone-base');
var csv = require('csv');
var getUri = require('get-uri');
var Goodtables = require('goodtables');
var highlight = require('highlight-redux');
var jsonEditor = require('json-editor');
var jtsInfer = require('json-table-schema').infer;
var registry = require('./registry');
var UploadView = require('./upload');
var _ = require('underscore');
var $ = require('jquery');


// Convert name into title
function titleize(name) {
  return name
    .replace(/[\-\._]+/g, ' ')
    .replace(/([a-z]{1})([A-Z]{1})/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

// Upload data file and populate .resource array with item
DataUploadView = backbone.BaseView.extend({
  events: {
    // Set up and append .resources row
    'change [data-id=input]': function(E) {
      FileAPI.readAsText(FileAPI.getFiles(E.currentTarget)[0], (function (EV) {
        if(EV.type === 'load') {
          csv.parse(EV.result, (function(E, D) {
            var schema;


            if(E)
              throw E;

            schema = jtsInfer(D[0], _.rest(D));

            this.options.form.getEditor('root.resources').addRow({
              name: _.last(EV.target.name.split('/')).toLowerCase().replace(/\.[^.]+$|[^a-z^\-^\d^_^\.]+/g, ''),
              path: EV.target.name,
              schema: schema
            }, true);

            // Save data source in the form
            _.last(this.options.form.getEditor('root.resources').rows).dataSource = {schema: schema, data: EV.result};
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
      .append(
        $(this.options.form.theme.getButton('Upload data file', '', 'Upload data file'))
          .attr('data-id', 'upload-data-file')
      )

      .append('<input data-id="input" type="file" accept="text/csv" style="display: none;">');

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
      // Populate main title and resource title fields
      'keyup input[name="root[name]"], [data-schemapath^="root.resources."].container-name input': function(event) {
        var $input = $(event.currentTarget);
        var $title = $input.closest('[data-schematype=object]').find('.row .container-title input').eq(0);

        // Do not populate user changed field
        if($title[0].edited)
          return true;

        $title.val(titleize($input.val()));
      },

      // Do not populate title field with name field data if title was edited
      // by user. Consider it is not edited once user empties it.
      'keyup input[name="root[title]"], [data-schemapath^="root.resources."].container-title input': function(event) {
        var $input = $(event.currentTarget);


        event.currentTarget.edited = Boolean($input.val());

        // If user empties the title field then populate it with name field value
        if(!event.currentTarget.edited)
          $input.closest('[data-schematype=object]').find('.row .container-name input').trigger('keyup');
      },

      'click #validate-resources': function() {
        var goodTables = new Goodtables({method: 'post', report_type: 'grouped'});

        // Navigate to valifation results just once during series of API calls
        var navigateToResults = _.once(function(id) { window.ROUTER.navigate('/validation-results/' + id, {trigger: true}); });


        window.APP.layout.validationResultList.reset(new backbone.Collection());

        _.each(this.layout.form.getEditor('root.resources').rows, function(R) {
          goodTables.run(R.dataSource.data, JSON.stringify(R.dataSource.schema)).then(
            function(M) {
              // Validation completed
              window.APP.layout.validationResultList.collection

                // Grouped report has complicated structure
                .add(M.getGroupedByRows().map(function(SR) { return _.extend(_.values(SR)[0], {
                  headers: M.getHeaders(),
                  resource_id: R.key
                }); }));

              // Navigate between resources in validation results
              window.APP.layout.validationResultList.layout.tabs.add(new backbone.Model({
                title: R.getValue().path,

                // .key is a unique property among all resources rows
                url: '/validation-results/' + R.key
              }));

              navigateToResults(R.key);
            }
          );
        });
      }
    },

    initialize: function(options) {
      highlight.configure({useBR: true});

      // Customize theme
      JSONEditor.defaults.iconlibs.fontawesome4 = JSONEditor.defaults.iconlibs.fontawesome4.extend({
        mapping: {
          'collapse': 'minus',
          'expand'  : 'plus',
          'delete'  : 'times',
          'edit'    : 'pencil',
          'add'     : 'plus',
          'cancel'  : 'ban',
          'save'    : 'save',
          'moveup'  : 'arrow-up',
          'movedown': 'arrow-down'
        }
      });

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

      // Proper representation of all form buttons. Avoid changing each newly
      // rendered button by rewriting the .getButton()
      JSONEditor.defaults.themes.bootstrap3.prototype.getButton = function(text, icon, title) {
        var el = document.createElement('button');

        el.type = 'button';
        el.className += 'btn btn-info btn-sm';
        this.setButtonText(el,text,icon,title);
        return el;
      };

      this.layout.form = new JSONEditor(this.$('[data-id=form-container]').get(0), {
        schema: schema,
        theme: 'bootstrap3',
        disable_edit_json: true,
        disable_properties: true,
        iconlib: 'fontawesome4'
      });

      // Remove Top-level collapse button
      this.layout.form.root.toggle_button.remove()

      // Bind local event to form nodes after form is renedered
      this.delegateEvents();

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
          var resources = this.layout.form.getEditor('root.resources');
          var resourcesLength = _.result(resources.rows, 'length');


          this.changed = true;
          window.APP.layout.download.reset(this.layout.form.getValue(), schema).activate();
          this.showResult();

          // Expand resources section if there are any resources, collapse if row is empty
          if(resourcesLength && resources.collapsed || !resourcesLength && !resources.collapsed)
            $(resources.toggle_button).trigger('click');

          // Do not allow changing schema field type — disable type selectbox
          this.$('[data-schemapath]:not([data-schematype]) select.form-control').prop('hidden', true);
        }).bind(this)));

        $('#json-code').prop('hidden', true);
        window.APP.layout.errorList.$el.prop('hidden', true);

        // Collapse editor and add empty item if it has no value
        _.each(this.$('[data-schemapath^="root."]:has(.json-editor-btn-collapse)'), function(E) {
          var editor = this.layout.form.getEditor($(E).data('schemapath'));
          var isEmpty = _.isEmpty(editor.getValue());


          // Empty array data should have one empty item
          if(_.contains(['resources', 'sources', 'licences'], E.dataset.schemapath.replace('root.', '')))
            $(editor.add_row_button).trigger('click');

          if(isEmpty && !editor.collapsed)
            $(editor.toggle_button).trigger('click');
        }, this);

        // Looks like previous loop is somehow async
        setTimeout((function() {
          $('#json-code').prop('hidden', false);
          window.APP.layout.errorList.reset(new backbone.Collection([])).$el.prop('hidden', false);
        }).bind(this), 300);

        // If on the previous form was entered values try to apply it to new form
        if(formData)
          this.layout.form.setValue(_.extend({}, this.layout.form.getValue(formData), formData));

        // Remove collapse button on add new item in collection
        _.each(this.$('[data-schemapath][data-schemapath!=root]:has(.json-editor-btn-add)'), function(E) {
          var
            editor = this.layout.form.getEditor($(E).data('schemapath'));

          $(_.pluck(editor.rows, 'toggle_button')).remove();

          $(editor.add_row_button).click((function() {
            $(_.last(this.rows).toggle_button).remove();
          }).bind(editor));
        }, this);
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
