var _ = require('underscore');
var backbone = require('backbone');
var deepEmpty = require('deep-empty');
var outfile = require('datapackage-outfile');
var validator = require('datapackage-validate');


// Returns path for json-editor
function convertPath(path) { return 'root' + path.replace(/\//g, '.'); }

// Download validated datapackage
module.exports = backbone.BaseView.extend({
  events: {
    'click': function(event) {
      var href = this.$el.attr('href');
      if ((href == '') || this.$el.hasClass('is-empty')) {
        window.APP.layout.notificationDialog.showValidationErrors();

        event.preventDefault();
        event.returnValue = false;
        return false;
      }
    }
  },
  reset: function(descriptor, schema) {
    var form = window.APP.layout.descriptorEdit.layout.form;

    this.$el.addClass('disabled is-empty').attr('href', '');

    // Drop errors of empty fields which are actually not required
    validator.validate(descriptor, schema).then((function(R) {
      var errors = _.filter(R.errors, function(E) {
        var editor = form.getEditor(convertPath(E.dataPath));
        var isRequired = editor.parent && _.contains(editor.parent.schema.required, editor.key);
        var value = editor.getValue();


        return isRequired || !isRequired && editor.getValue() && !_.isEmpty(deepEmpty(editor.getValue()));
      });

      // Place .anyOf validation errors on form
      _.each(errors, function(E) {
        var editor = form.getEditor(convertPath(E.dataPath));


        if(parseInt(E.code) !== 10)
          return false;

        editor.showValidationErrors([{
          message: 'Any of these fields should not be empty: ' + _.map(E.subErrors, function(E) {
            return E.params.key;
          }).join(', '),

          path: convertPath(E.dataPath)
        }]);

        // Previous .showValidationErrors() strips nested editors errors — restore them
        _.each(editor.editors, function(V, K) { V.showValidationErrors(V.jsoneditor.validation_results); });
      });

      if(!errors.length && !_.isEmpty(descriptor)) {
        this.$el
          .removeClass('disabled is-empty')
          .attr('href', encodeURI(outfile(descriptor, {
            IE9: window.APP.browser.name == 'ie' && parseInt(window.APP.browser.version.split('.')[0]) <= 9
          })));
      }
    }).bind(this));

    return this;
  }
});
