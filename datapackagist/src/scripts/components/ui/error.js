var backbone = require('backbone');


module.exports = {
  ListView: backbone.BaseListView.extend({
    ItemView: backbone.BaseView.extend({
      attributes: {class: 'error-message', 'data-id': 'messages'},
      tagName: 'li',

      render: function() {
        this.$el.html(this.model.get('message'));
        return this;
      }
    })
  })
};
