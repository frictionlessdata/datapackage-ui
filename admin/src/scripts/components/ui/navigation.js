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
          .attr('href', '/');

        return this;
      },

      tagName: 'a'
    })
  })
};
