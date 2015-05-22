var backbone = require('backbone');


module.exports = {
  ListView: backbone.BaseListView.extend({
    events: {
      'change': function(event) { this.trigger('change', event); }
    },
    getSelected: function(){
      if(this.$el.val())
        return this.collection.get( this.$el.val() );
    },
    ItemView: backbone.BaseView.extend({
      tagName: 'option',
      render: function() {
        this.$el
          .attr('value', this.model.cid)
          .html(this.model.get('title'));
        return this;
      }
    })
  })
};
