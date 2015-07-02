var backbone = require('backbone');
var backboneBase = require('backbone-base');
var outfile = require('datapackage-outfile');
var validator = require('datapackage-validate');


// Download validated datapackage
module.exports = backbone.BaseView.extend({
  reset: function(descriptor, schema) {
    this.$el.addClass('disabled');

    validator.validate(window.APP.layout.descriptorEdit.layout.form.getValue(), schema).then((function(R) {
      if(R.valid)
        this.$el
          .removeClass('disabled')

          .attr('href', outfile(descriptor, {
            IE9: window.APP.browser.name == 'ie' && parseInt(window.APP.browser.version.split('.')[0]) <= 9
          }));
    }).bind(this));

    return this;
  }
});
