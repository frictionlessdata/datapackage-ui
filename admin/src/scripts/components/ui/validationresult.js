var backbone = require('backbone');


module.exports = {
  ListView: backbone.BaseListView.extend({
    events: {'click [data-id=back]': function() { window.ROUTER.navigate('/', {trigger: true}); return false; }},

    ItemView: backbone.BaseView.extend({
      attributes: {class: 'error-message', 'data-id': 'messages'},
      tagName: 'li',

      render: function() {
        this.$el.html(this.model.get('result_message'));
        return this;
      }
    })
  })
};
