require('fileapi');

var backbone = require('backbone');
var backboneBase = require('backbone-base');
var csv = require('csv');
var deepEmpty = require('deep-empty');
var getUri = require('get-uri');
var highlight = require('highlight-redux');
var jsonEditor = require('json-editor');
var jtsInfer = require('json-table-schema').infer;
var omitEmpty = require('omit-empty');
var registry = require('./registry');
var request = require('superagent-bluebird-promise');
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
            var editor = window.APP.layout.descriptorEdit.layout.form.getEditor('root.resources');

            var rowValue = {
              name: _.last(EV.target.name.split('/')).toLowerCase().replace(/\.[^.]+$|[^a-z^\-^\d^_^\.]+/g, ''),
              path: EV.target.name
            };


            if(E)
              throw E;

            rowValue.schema = jtsInfer(D[0], _.rest(D));

            // If there is single empty row — apply 
            if(_.isEmpty(window.APP.layout.descriptorEdit.getValue().resources) && !_.isEmpty(editor.rows))
              editor.rows[0].setValue(rowValue, true);
            else
              editor.addRow(rowValue, true);

            // Save data source in the form
            _.last(editor.rows).dataSource = {schema: schema, data: EV.result};

            window.APP.layout.descriptorEdit.populateTitlesFromNames();
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
        $(window.APP.layout.descriptorEdit.layout.form.theme.getButton('Upload data file', '', 'Upload data file'))
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
      'keyup [data-schemapath].container-name input': function(event) {
        var $input = $(event.currentTarget);
        var $title = $input.closest('[data-schematype=object]').find('.row .container-title input').eq(0);
        var nameEditor = this.layout.form.getEditor($input.closest('[data-schemapath]').data('schemapath'));


        // Force name value change. Normally it will be changed after focues losed
        // from input field.
        nameEditor.setValue($input.val());
        nameEditor.refreshValue();
        nameEditor.onChange(true);

        // Do not populate user changed field or name with no title in the same row
        if(_.result($title[0], 'edited') || !$title.length)
          return true;

        this.layout.form
          .getEditor($title.closest('[data-schemapath]').data('schemapath'))
          .setValue(titleize($input.val()));
      },

      // Do not populate title field with name field data if title was edited
      // by user. Consider it is not edited once user empties it.
      'keyup [data-schemapath].container-title input': function(event) {
        var $input = $(event.currentTarget);


        event.currentTarget.edited = Boolean($input.val());

        // If user empties the title field then populate it with name field value
        if(!event.currentTarget.edited)
          $input.closest('[data-schematype=object]').find('.row .container-name input').trigger('keyup');
      },

      'click #validate-resources': function() {
        window.APP.layout.validationResultList.validateResources(this.layout.form.getEditor('root.resources').rows);
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

      // Mark required fields
      JSONEditor.defaults.editors = _.mapObject(JSONEditor.defaults.editors, function(E, K) {
        return E.extend({
          updateHeaderText: function() {
            if(this.parent && _.indexOf(this.parent.schema.required, this.key) >= 0)
              $(this.label).html(this.getTitle() + ' <label class="required-field">*</label>');
            else
              JSONEditor.AbstractEditor.prototype.updateHeaderText.apply(this, arguments);
          }
        });
      });

      return backbone.BaseView.prototype.initialize.call(this, options);
    },

    render: function() {
      this.layout.upload = new UploadView({el: window.APP.$('#upload-data-package'), parent: this});
      this.layout.registryList = new registry.ListView({el: window.APP.$('#registry-list'), container: '[data-id=list-container]', parent: this});
      return this;
    },

    // Omit empty properties and "0" values of object properties put into array.
    // Stick with that complex solution because "0" is the default value
    getValue: function () { return deepEmpty(this.layout.form.getValue(), function(O) {
      return !_.isEmpty(O) && !_.every(O, function(I) { return _.isEmpty(omitEmpty(I, true)); })
    }); },

    hasChanges: function() { return Boolean(this.changed); },

    // Populate empty title fields with name field value. Rely on DOM events defined
    // in DescriptorEditView.events
    populateTitlesFromNames: function() {
      _.each(this.$('[data-schemapath].container-title input'), function(I) {
        I.edited = Boolean($(I).val());
      });

      this.$('[data-schemapath].container-name input').trigger('keyup');
      return this;
    },

    reset: function(schema) {
      var formData;


      // Clean up previous state
      if(this.layout.form) {
        formData = this.getValue();
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
        show_errors: 'change',
        theme: 'bootstrap3',
        disable_edit_json: true,
        disable_properties: true,
        iconlib: 'fontawesome4'
      });

      // Remove Top-level collapse button
      $(this.layout.form.root.toggle_button).remove();

      // Bind local event to form nodes after form is renedered
      this.delegateEvents();

      this.layout.uploadData = (new DataUploadView({
        el: this.layout.form.theme.getHeaderButtonHolder(),
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
          window.APP.layout.download.reset(this.getValue(), schema).activate();
          this.showResult();

          // Expand resources section if there are any resources, collapse if row is empty
          if(resourcesLength && resources.collapsed || !resourcesLength && !resources.collapsed)
            $(resources.toggle_button).trigger('click');

          // Do not allow changing schema field type — disable type selectbox
          this.$('[data-schemapath]:not([data-schematype]) select.form-control').prop('hidden', true);
        }).bind(this)));

        this.populateTitlesFromNames();
        $('#json-code').prop('hidden', true);

        // Collapse editor and add empty item if it has no value
        _.each(this.$('[data-schemapath^="root."]:has(.json-editor-btn-collapse)'), function(E) {
          var editor = this.layout.form.getEditor($(E).data('schemapath'));
          var isEmpty = _.isEmpty(editor.getValue());

          if(!E.dataset)
            return false;

          // Empty array data should have one empty item
          if(_.contains(['resources'], E.dataset.schemapath.replace('root.', '')) && !editor.rows.length)
            $(editor.add_row_button).trigger('click');

          if(isEmpty && !editor.collapsed)
            $(editor.toggle_button).trigger('click');
        }, this);

        // Looks like previous loop is somehow async
        setTimeout((function() { $('#json-code').prop('hidden', false); }).bind(this), 300);

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
        highlight.highlight('json', JSON.stringify(this.getValue(), undefined, 2)).value
      ));

      return this;
    }
  })
};
