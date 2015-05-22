var backbone = require('backbone');


module.exports = {
  ListView: backbone.BaseListView.extend({
    clear: function() {
      backbone.BaseListView.prototype.clear.apply(this, arguments);
      this.$el.append('<option value="">-- Select --</option>');
      return this;
    },
    events: {
      'change': function(event) {
        var
          selected = this.collection.get( this.$el.val() );

        this.parent.schema = {$ref: selected && selected.get('schema')};
        this.parent.render();
      }
    },
    ItemView: backbone.BaseView.extend({
      render: function() {
        this.$el
          .attr('value', this.model.cid)
          .html(this.model.get('title'));
        return this;
      },
      tagName: 'option'
    }),
    tagName: 'select'
  })
};
