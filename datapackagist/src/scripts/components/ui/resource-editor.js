var jsonEditor = require('./jsoneditform');
var _ = require('underscore');


jsonEditor.JSONEditorView.defaults.editors.resources = JSONEditor.defaults.editors.array.extend({
  getDataSource: function() {
    return _.pluck(this.rows, 'dataSource');
  },

  add: function(rowValue, dataSource) {
    // If there is single empty row — apply
    if(_.isEmpty(this.jsoneditor.getCleanValue().resources) && !_.isEmpty(this.rows))
      this.rows[0].setValue(rowValue, true);
    else
      this.addRow(rowValue, true);

    // Save data source in the form
    _.last(this.rows).dataSource = dataSource;
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

