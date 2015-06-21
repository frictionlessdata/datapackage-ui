var backbone = require('backbone');
var backboneBase = require('backbone-base');
var outfile = require('datapackage-outfile');
var validator = require('datapackage-validate');


module.exports = backbone.BaseView.extend({
  events: {
    'click': function() {
      window.APP.layout.errorList.clear();

      var
        validateResult = validator.validate(window.APP.layout.descriptorEdit.layout.form.getValue());

      if(!validateResult.valid)
        window.APP.layout.errorList.reset(new backbone.Collection(validateResult.errors));

      return validateResult.valid;
    }
  },

  reset: function(descriptor) {
    this.$el.attr('href', outfile(descriptor, {
      IE9: window.APP.browser.name == 'ie' && parseInt(window.APP.browser.version.split('.')[0]) <= 9
    }));

    return this;
  }
});
