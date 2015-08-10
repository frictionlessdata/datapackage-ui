require('fileapi');

var backbone = require('backbone');
var backboneBase = require('backbone-base');
var csv = require('csv');
var getUri = require('get-uri');
var highlight = require('highlight-redux');
var jsonEditor = require('./jsoneditform');
var resourceEditor = require('./resource-editor');
var jtsInfer = require('json-table-schema').infer;
var registry = require('./registry');
var request = require('superagent-bluebird-promise');
var UploadView = require('./upload');
var _ = require('underscore');
var $ = require('jquery');
var Promise = require('bluebird');


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
            editor.add(rowValue, {schema: schema, data: EV.result});
            window.APP.layout.descriptorEdit.layout.form.validateResources();
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
      'keyup [data-schemapath$=".name"] input': function(event) {
        var $input = $(event.currentTarget);
        var $title = $input.closest('[data-schematype=object]').find('[data-schemapath$=".title"] input').eq(0);
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
      'keyup [data-schemapath$=".title"] input': function(event) {
        var $input = $(event.currentTarget);


        // Ignore tab key pressed
        if(event.keyCode === 9)
          return true;

        event.currentTarget.edited = Boolean($input.val());

        // If user empties the title field then populate it with name field value
        if(!event.currentTarget.edited)
          $input.val($input.closest('[data-schematype=object]').find('[data-schemapath$=".name"] input').val());
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

    hasChanges: function() { return Boolean(this.layout.form.changed); },

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
      var formData, resourceDataSources;
      var init = (function() {

        this.layout.form = new jsonEditor.JSONEditorView(this.$('[data-id=form-container]').get(0), {
          schema            : schema,
          show_errors       : 'change',
          theme             : 'bootstrap3',
          dataSources       : resourceDataSources,
          disable_edit_json : true,
          disable_properties: true,
          iconlib           : 'fontawesome4',
          initialData       : formData
        });

        // Bind local event to form nodes after form is renedered
        this.delegateEvents();

        this.layout.form.on('ready', (function() {
          // There is no any good way to bind events to custom button or even add cutsom button
          $(this.layout.form.getEditor('root.resources').container)
            .children('h3').append(this.layout.uploadData.el);

          // After `ready` event fired, editor fire `change` event regarding to the initial changes
          this.layout.form.on('change', _.after(2, (function() {
            window.APP.layout.download.reset(this.layout.form.getCleanValue(), schema).activate();
            this.showResult();
          }).bind(this)));
        }).bind(this));

        this.layout.uploadData = (new DataUploadView({
          el: this.layout.form.theme.getHeaderButtonHolder(),
          parent: this
        })).render();

        this.populateTitlesFromNames();
        $('#json-code').prop('hidden', true);
      }).bind(this);

      // Clean up previous state
      if(this.layout.form) {
        formData = this.layout.form.getCleanValue();

        resourceDataSources = Promise.map(
          this.layout.form.getEditor('root.resources').rows,
          (function(R, I) { return this.layout.form.getEditor('root.resources').getDataSource(I)}).bind(this)
        ).then((function(R) {
            this.layout.form.destroy();
            this.layout.uploadData.undelegateEvents().remove();
            init();
          }).bind(this));
      } else init();
    },

    showResult: function() {
      $('#json-code').html(highlight.fixMarkup(
        highlight.highlight('json', JSON.stringify(this.layout.form.getCleanValue(), undefined, 2)).value
      ));

      return this;
    }
  })
};
