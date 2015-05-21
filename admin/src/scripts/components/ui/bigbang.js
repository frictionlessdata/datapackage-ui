var backbone = require('backbone');
var backboneBase = require('backbone-base');
var NavbarView = require('./navbar');
var descriptorEdit = require('./descriptoredit');


module.exports = backbone.BaseView.extend({
  render: function() {
    this.layout.navbar = new NavbarView({el: window.APP.$('#navbar')});
    (this.layout.descriptorEdit = new descriptorEdit.DescriptorEditView({el: window.APP.$('#form-editor')})).render();
    return this;
  }
});
