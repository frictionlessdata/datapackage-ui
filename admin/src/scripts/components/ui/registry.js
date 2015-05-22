var backbone = require('backbone');


module.exports = {
  ListView: backbone.BaseListView.extend({
    events: {
      'change': function() {
        var
          schema = this.$el.val() && this.collection.get( this.$el.val() ).get('schema');

        if( schema )
          this.parent.reset({$ref: schema});

        this.parent.activate(schema);
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
