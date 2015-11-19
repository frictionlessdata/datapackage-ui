/**
 * Created by Ihor Borysyuk on 17.11.15.
 */
var _ = require('underscore');
var backbone = require('backbone');
var deepEmpty = require('deep-empty');

// Download form
module.exports = backbone.BaseView.extend({
  setJson: function (json) {
    this.$el.find('#downloadJson').val(JSON.stringify(json));
  },

  download: function () {
    console.log(this.$el);
    this.$el.submit();
  }
});
