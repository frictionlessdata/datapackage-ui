var backbone = require('backbone');
var backboneBase = require('backbone-base');
var NavbarView = require('./navbar');
var form = require('./jsonform');


module.exports = backbone.BaseView.extend({
  render: function() {
    this.layout.navbar = new NavbarView({el: window.APP.$('#navbar')});
    (this.layout.jsonForm = new form.JSONForm({el: window.APP.$('#form-editor')})).render();
    return this;
  }
});
