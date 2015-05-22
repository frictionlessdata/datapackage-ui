var backbone = require('backbone');
var backboneBase = require('backbone-base');
var outfile = require('../datapackage-outfile');


module.exports = backbone.BaseView.extend({
  reset: function(descriptor) {
    this.$el.attr('href', outfile(descriptor, {
      IE9: window.APP.browser.name == 'ie' && parseInt(window.APP.browser.version.split('.')[0]) <= 9
    }));

    return this;
  }
});
