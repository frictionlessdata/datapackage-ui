var backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var deep = require('deep-diff');


module.exports = {
  ListView: backbone.BaseListView.extend({
    events: {
      'change': function() {
        var
          schema = this.$el.val() && this.collection.get( this.$el.val() ).get('schema');

        $.getJSON(schema, (function(schemaData) {
          if(this.parent.layout.form)
          {
            var
              // Keys of entered fields
              keys = _.keys(this.parent.getFilledValues());

            // If data can be lost - show confirmation message
            if(deep.diff(_.pick(schemaData.properties, keys), _.pick(this.parent.layout.form.schema.properties, keys)))
              return window.APP.layout.confirmationDialog
                .setMessage('Some data you have entered will be lost. Are you sure you want to change the Data Package Profile?')

                .setCallbacks({
                  yes: (function() {
                    this.parent.reset(schemaData);
                    window.APP.layout.confirmationDialog.deactivate();
                    return false;
                  }).bind(this)
                })

                .activate();
          }

          this.parent.reset(schemaData);

        }).bind(this));

        this.parent.activate(Boolean(schema));
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
