var backbone = require('backbone');
var backboneBase = require('backbone-base');
var NavbarView = require('./navbar');
var descriptorEdit = require('./descriptoredit');
var registry = require('./registry');


module.exports = backbone.BaseView.extend({
  render: function() {
    this.layout.navbar = new NavbarView({el: window.APP.$('#navbar')});
    (this.layout.descriptorEdit = new descriptorEdit.DescriptorEditView({el: window.APP.$('#form-editor')})).render();
    this.layout.registryList = new registry.ListView({el: window.APP.$('#registry-list')});
    return this;
  }
});
