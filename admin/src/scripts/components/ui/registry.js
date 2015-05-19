var backbone = require('backbone');


module.exports = {
  ListView: backbone.BaseListView.extend({
    ItemView: backbone.BaseView.extend({
      render: function() {
        // WARN Apply template here
        this.$el.html(
          '<a href="' + this.model.get('specification') + '">' + this.model.get('title') + '</a>'
        );

        return this;
      }
    })
  })
};
