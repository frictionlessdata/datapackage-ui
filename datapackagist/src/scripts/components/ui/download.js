var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');
var outfile = require('datapackage-outfile');
var validator = require('datapackage-validate');


// Download validated datapackage
module.exports = backbone.BaseView.extend({
  reset: function(descriptor, schema) {
    var form = window.APP.layout.descriptorEdit.layout.form;


    this.$el.addClass('disabled');

    // Drop errors of empty fields which are actually not required
    validator.validate(form.getValue(), schema).then((function(R) {
      var errors = _.filter(R.errors, function(E) {
        var editor = form.getEditor('root' + E.dataPath.replace(/\//g, '.'));
        var isRequired = _.contains(editor.parent.schema.required, editor.key);


        return isRequired || !isRequired && editor.getValue();
      });

      if(!errors.length)
        this.$el
          .removeClass('disabled')

          .attr('href', outfile(descriptor, {
            IE9: window.APP.browser.name == 'ie' && parseInt(window.APP.browser.version.split('.')[0]) <= 9
          }));
    }).bind(this));

    return this;
  }
});
