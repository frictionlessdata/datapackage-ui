var backbone = require('backbone');
var backboneBase = require('backbone-base');
var outfile = require('../datapackage-outfile');


module.exports = backbone.BaseView.extend({
  reset: function(descriptor) {
    this.$el.attr('href', outfile(descriptor));
    return this;
  }
});
