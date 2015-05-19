var backbone = require('backbone');


module.exports = {
  ListView: backbone.BaseListView.extend({
    ItemView: backbone.BaseView.extend({
      render: function() {
        this.$el.html(this.model.id);
        return this;
      }
    })
  })
};
