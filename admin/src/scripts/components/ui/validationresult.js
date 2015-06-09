var _ = require('underscore');
var backbone = require('backbone');
var navigation = require('./navigation');
var validationErrorRowTpl = require('./templates/validation-error-row.hbs');


module.exports = {
  ListView: backbone.BaseListView.extend({
    clear: function() {
      backbone.BaseListView.prototype.clear.call(this);
      this.layout.tabs.clear();
      return this;
    },

    events: {'click [data-id=back]': function() { window.ROUTER.navigate('/', {trigger: true}); return false; }},

    ItemView: backbone.BaseView.extend({
      attributes: {class: 'result panel panel-default'},

      render: function() {
        this.$el.html(this.template(_.extend(this.model.toJSON(), {
          isheader: this.model.get('row_index') === 0
        })));

        return this;
      },

      template: validationErrorRowTpl
    }),

    render: function() {
      this.layout.tabs = new navigation.TabsView({el: this.$('[data-id=tabs]')});
      return this;
    },

    reset: function(collection) {
      backbone.BaseListView.prototype.reset.call(this, collection);
      this.collection.on('add', this.add, this);
      return this;
    },

    // Show certain resource validation errors
    setActive: function(id) {
      this.layout.items.forEach(function(I) { I.activate(I.model.get('resource_id') === id); });
      return this;
    }
  })
};
