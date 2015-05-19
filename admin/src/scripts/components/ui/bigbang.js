var backbone = require('backbone');
var backboneBase = require('backbone-base');
var NavbarView = require('./navbar');


module.exports = backbone.BaseView.extend({
  render: function() {
    this.layout.navbar = new NavbarView({el: window.APP.$('#navbar')});
    return this;
  }
});
