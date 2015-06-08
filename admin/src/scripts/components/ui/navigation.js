var backbone = require('backbone');
var backboneBase = require('backbone-base');


module.exports = {
  NavbarView: backbone.BaseView.extend({
    events: {
      'click [data-id=badge]': function() {
        this.toggleBadge();
        return false;
      }
    },

    toggleBadge: function(state) {
      this.$('[data-id=badge]').toggleClass('collapsed', state);
      return this;
    }
  }),

  // Used for navigation between resources validation results
  TabsView: backbone.BaseListView.extend({
    add: function(model) {
      backbone.BaseListView.prototype.add.call(this, model);

      // Don't show single tab
      this.$el.prop('hidden', this.layout.items.length === 1);

      return this;
    },

    ItemView: backbone.BaseView.extend({
      events: {
        'click': function(event) {
          window.ROUTER.navigate($(event.currentTarget).attr('href'), {trigger: true});
          return false;
        }
      },

      render: function() {
        this.$el
          .html(this.model.get('title'))
          .attr('href', this.model.get('url'));

        return this;
      },

      tagName: 'a'
    })
  })
};
