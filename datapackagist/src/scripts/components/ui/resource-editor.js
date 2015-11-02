var config = require('../../config');
var csv = require('csv');
var jsonEditor = require('./jsoneditform');
var jtsInfer = require('json-table-schema').infer;
var _ = require('underscore');
var Promise = require('bluebird');
var request = require('superagent-bluebird-promise');
var validator = require('validator');
var CSV = require('./csv-resource');


// Custom editor for managing resources rows
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
      var url = _.result(row.editors.url, 'getValue');


      if (row.dataSource) {
        RS(row.dataSource);
        return true;
      }

      // If data source stored as URL in a row then first grab it
      console.log('################################################');
      console.log(row.editors);
      console.log(url);
      console.log('-------------------------------------------------');
      console.log(row.editors.mediatype.getValue());
      console.log('################################################');
      if (
          validator.isURL(url) &&
          (
              (row.editors.format && row.editors.format.getValue() == 'text/csv') ||
              (row.editors.mediatype && row.editors.mediatype.getValue() == 'text/csv') ||
            _.last(url.split('.')).toLowerCase() === 'csv'
          )
      ){

        //return (new Promise(
        //    (function(resolve, reject) {
        //      CSV.getResourceFromUrl(config.corsProxyURL(url), {preview: config.maxCSVRows}).then(
        //        (function (resourceInfo) {
        //            resolve({
        //              data: resourceInfo.data,
        //              schema: resourceInfo.info.schema
        //            });
        //        })
        //      ).catch(
        //        function(){
        //          reject();
        //          return false;
        //        });
        //    })
        //)).then((function (DS) {
        //      this.dataSource = DS;
        //      return DS;
        //    }).bind(this));

        return request.get(config.corsProxyURL(url)).then(function (RES) {
          // Need schema
          return (new Promise(function (RS, RJ) {
            csv.parse(RES.text, function (E, D) {
              if (E) {
                RJ(E);
                return false;
              }

              var D1000 = D.slice(0, 1000);
              RS({
                data: RES.text,
                schema: jtsInfer(D[0], _.rest(D1000))
              });
            });
          }))
              .then((function (DS) {
                this.dataSource = DS;
                return DS;
              }).bind(this));
        });

      // TODO return correct data when there is workaround for file paths
      } else {
        if (!url) {
          RS({});
        } else {
          RJ(new Error('Resource URL is broken or resource has wrong file type (should be CSV): ' + url));
        }
      }
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

