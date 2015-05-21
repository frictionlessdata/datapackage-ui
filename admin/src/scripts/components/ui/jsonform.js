var backbone = require('backbone');


module.exports = {
  JSONForm: backbone.BaseView.extend({
    render: function() {
      this.$el.html('JSON Form here');
      return this;
    }
  })
};