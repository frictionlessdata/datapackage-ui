var backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var deep = require('deep-diff');


module.exports = {
  ListView: backbone.BaseListView.extend({
    events: {
      'change': function(event) { this.setSelectedSchema(this.$(this.options.container).val()); }
    },

    // Returns schema object
    getSchema: function() { return this.schemaData; },

    // Returns schema URL
    getSelectedSchema: function() {
      return this.collection.get(this.$(this.options.container).val()).get('schema');
    },

    ItemView: backbone.BaseView.extend({
      render: function() {
        this.$el
          .attr('value', this.model.id)
          .html(this.model.get('title'));

        return this;
      },

      tagName: 'option'
    }),

    reset: function(collection) {
      backbone.BaseListView.prototype.reset.call(this, collection);

      // Used to restore previous value when user selects No in confirmation dialog
      this.selectedValue = this.$(this.options.container).val();

      $.getJSON(this.getSelectedSchema(), (function(schemaData) {
        this.schemaData = schemaData;
        this.parent.reset(schemaData);
      }).bind(this));

      return this;
    },

    // Update selectbox and trigger change event
    setSelectedSchema: function(id) {
      this.$el.val(id);

      return new Promise((function(RS, RJ) {
        $.getJSON(this.collection.get(id).get('schema'), (function(schemaData) {
          var
            // Keys of entered fields
            keys = _.keys(this.parent.getFilledValues());

          this.schemaData = schemaData;

          // If data can be lost - show confirmation message
          if(deep.diff(_.pick(schemaData.properties, keys), _.pick(this.parent.layout.form.schema.properties, keys)))
            return window.APP.layout.confirmationDialog
              .setMessage('Some data you have entered will be lost. Are you sure you want to change the Data Package Profile?')

              .setCallbacks({
                yes: (function() {
                  this.selectedValue = this.$(this.options.container).val();
                  this.parent.reset(schemaData);
                  window.APP.layout.confirmationDialog.deactivate();
                  RS(schemaData);
                }).bind(this),

                no: (function() {
                  this.$(this.options.container).val(this.selectedValue);
                  window.APP.layout.confirmationDialog.deactivate();
                  RS(schemaData);
                }).bind(this)
              })

              .activate();

          else
            this.selectedValue = this.$(this.options.container).val();

          this.parent.reset(schemaData);
          RS(schemaData);
        }).bind(this));
      }).bind(this));

      return this;
    },

    tagName: 'select'
  })
};
