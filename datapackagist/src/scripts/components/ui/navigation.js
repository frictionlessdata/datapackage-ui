var backbone = require('backbone');
var _ = require('underscore');

// https://raw.githubusercontent.com/rgrp/dataset-gla/master/data/all.csv

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
    addItemView: function(view) {
      backbone.BaseListView.prototype.addItemView.call(this, view);
      view.activate().setActive(
        view.model.get('resource_id') == this.parent.activeResource);
      return this;
    },

    ItemView: backbone.BaseView.extend({
      events: {
        'click': function() {
          this.parent.parent.setActive(this.model.get('resource_id'));
          return false;
        }
      },

      setActive: function(active) {
        active = !!active || _.isUndefined(active);
        if (active) {
          _.forEach(this.parent.layout.items, function(item) {
            item.setActive(false);
          });
          this.$el.addClass('active');
        } else {
          this.$el.removeClass('active');
        }
      },

      render: function() {
        $('<a>')
          .attr('href', 'javascript:void(0)')
          .html(this.model.get('title') || '<i>(Untitled)</i>')
          .appendTo(this.$el);

        return this;
      },

      tagName: 'li'
    })
  })
};
