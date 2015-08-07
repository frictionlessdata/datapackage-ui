var jsonEditor = require('./jsoneditform');
var _ = require('underscore');
var Promise = require('bluebird');


jsonEditor.JSONEditorView.defaults.editors.resources = JSONEditor.defaults.editors.array.extend({
  add: function(rowValue, dataSource) {
    // If there is single empty row — apply
    if(_.isEmpty(this.jsoneditor.getCleanValue().resources) && !_.isEmpty(this.rows))
      this.rows[0].setValue(rowValue, true);
    else
      this.addRow(rowValue, true);

    // Save data source in the form
    _.last(this.rows).dataSource = dataSource;
  },

  getDataSource: function(rowIndex) {
    return new Promise((function(RS, RJ) {
      var row = this.rows[rowIndex];
      var url = row.editors.url.getValue();


      if(row.dataSource) {
        RS(row.dataSource);
        return true;
      }

      if(row.editors.format.getValue() == 'csv' && url)
        request
          .get(url)
          .then((function(R) {
            row.dataSource = {schema: window.APP.layout.descriptorEdit.layout.registryList.schemaData, data: R.text};
            RS(row.dataSource);
          }).bind(this));
    }).bind(this));

  },

  init: function() {
    JSONEditor.defaults.editors.array.prototype.init.apply(this, arguments);

    this.jsoneditor.on('ready', (function() {
      // Copy metadata for resources data source
      if(this.jsoneditor.options.dataSources)
        _.each(this.rows, function(R, I) { R.dataSource = this.dataSources[I]; }, this.jsoneditor.options);
    }).bind(this))
  }
});

// Add a resolver function to the beginning of the resolver list
// This will make it run before any other ones
jsonEditor.JSONEditorView.defaults.resolvers.unshift(function(schema) {

  if(schema.type === 'array' && schema.title === 'Resources') {
    return 'resources';
  }

  // If no valid editor is returned, the next resolver function will be used
});

