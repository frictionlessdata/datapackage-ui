var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');
var Goodtables = require('goodtables');
var navigation = require('./navigation');
var Promise = require('bluebird');
var validationErrorRowTpl = require('./templates/validation-error-row.hbs');
var validator = require('validator');


module.exports = {
  // Render reource data file validation error
  ListView: backbone.BaseListView.extend({
    // Hide newly added results if they are for another tab
    addItemView: function(view, container) {
      this.$('#ok-message').prop('hidden', true);
      view.activate(view.model.get('resource_id') === this.parent.activeResource);
      backbone.BaseListView.prototype.addItemView.call(this, view);
      return this;
    },

    clear: function() {
      backbone.BaseListView.prototype.clear.call(this);
      this.$('#ok-message').prop('hidden', false);
      this.parent.layout.tabs.clear();
      return this;
    },

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

    reset: function(collection) {
      backbone.BaseListView.prototype.reset.call(this, collection);
      this.collection.on('add', this.add, this);
      return this;
    }
  }),

  // Errors list with tabs for navigating between errors groupped by resource
  ValidationResultsView: backbone.BaseView.extend({
    events: {'click [data-id=back]': function() { window.ROUTER.navigate('/', {trigger: true}); return false; }},

    render: function() {
      this.layout.tabs = new navigation.TabsView({el: this.$('[data-id=tabs]')});
      this.layout.list = new module.exports.ListView({el: this.$('[data-id=errors-list]'), parent: this});
      return this;
    },

    validateResources: function(resourcesRows) {
      window.alert('validateResources: function(resourcesRows)');

      var goodTables = new Goodtables({method: 'post', report_type: 'grouped'});

      // Navigate to valifation results just once during series of API calls
      var navigateToResults = _.once(function(id) { window.ROUTER.navigate('/validation-results/' + id, {trigger: true}); });


      this.layout.list.reset(new backbone.Collection());
      // Validate each row, one by one, render errors after each row validated
      Promise.each(
        resourcesRows,
        function(R, I) {
          return window.APP.layout.descriptorEdit.layout.form.getEditor('root.resources').getDataSource(I)
        }
      ).then((function(DS) {
          var that = this;

        _.each(DS, function(R) {
          // Conditional promises
          return (function() {
            // Resource was downloaded by user
            if(R.dataSource) {
              console.log('==================================================================================');
              console.log(R.dataSource);
              return goodTables.run(R.dataSource.data, JSON.stringify(R.dataSource.schema));
            }

            // Default fall back
            return new Promise(function(RS, RJ) { RS(false); });
          })()

            .then(function(M) {
              if(!M)
                return false;

              // Validation completed, render errors list
              that.layout.list.collection

                // Grouped report has complicated structure
                .add(M.getGroupedByRows().map(function(SR) { return _.extend(_.values(SR)[0], {
                  headers: M.getHeaders(),
                  resource_id: R.key
                }); }));

              // Navigate between resources in validation results
              if(!_.isEmpty(M.getGroupedByRows()))
                that.layout.tabs.add(new backbone.Model({
                  title: R.getValue().path,

                  // .key is a unique property among all resources rows
                  url: '/validation-results/' + R.key
                }));
            })

            .catch(console.log);
      }, this) }).bind(this)).then((function() {
        // After all resources validated navigate to first tab
        navigateToResults(
          this.layout.list.collection.length ? this.layout.list.collection.at(0).get('resource_id') : '0'
        );
      }).bind(this));

      return this;
    },

    // Show certain resource validation errors
    setActive: function(id) {
      this.activeResource = id;
      this.layout.list.layout.items.forEach(function(I) { I.activate(I.model.get('resource_id') === id); });
      return this;
    }
  })
};
