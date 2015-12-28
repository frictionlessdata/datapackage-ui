/**
 * Created by Ihor Borysyuk on 28.10.15.
 */
var _ = require('underscore');
var Promise = require('bluebird');
var csvParser = require('papaparse');
var jtsInfer = require('json-table-schema').infer;
var titleize = require('i')().titleize;


function createCSVResourse() {
    function _extendResult(result) {
        var mixMethods = {
            headers: function () {
                return (this.data.length) ? this.data[0] : [];
            }
        };
        return _.extend(result, mixMethods);
    };

    function _parse(csvFile, options) {
        return new Promise(
            function (resolve, reject) {
                var config = {
                    complete: function (results) {
                        results = _extendResult(results);
                        if (results.errors.length) {
                            reject(results);
                        } else {
                            resolve(results);
                        }
                    }
                };
                config = _.extend(config, options);
                csvParser.parse(csvFile, config);
            }
        );
    }

    return {
        parseFile: function (csvFile, options) {
            return _parse(csvFile, options);
        },

        parseUrl: function (csvUrl, options) {
            options = options || {};
            options = _.extend(options, {download: true});
            return _parse(csvUrl, options);
        },

        getName: function (identifier) {
            identifier = _.last(identifier.split('/'));// http://example.com/sample.csv?bla-bla -> sample.csv?bla-bla
            identifier = (identifier.split('?'))[0]; //sample.csv?bla-bla -> sample.csv
            identifier = (identifier.split('.'))[0];
            return identifier;
        },

        getTitle: function (name) {
            return titleize(name).replace(/\s+/g, ' ').trim();
        },

        getResourceFromCSVResult: function (source, isFile, result) {
            var identifier = (isFile) ? source.name : source;
            var name = this.getName(identifier);

            var info = {
                name: name,
                title: this.getTitle(name),
                url: (isFile) ? "" : identifier,
                path: (isFile) ? identifier : "",
                format: 'CSV',
                mediatype: 'text/csv',
                schema: jtsInfer(result.headers(), _.rest(result.data))
            };

            return {
                data: result.data,
                info: info
            };
        },

        getResource: function (csv, isFile, options) {
            return new Promise(
                (function (resolve, reject) {
                    var parseFunction = (isFile) ? 'parseFile' : 'parseUrl';
                    this[parseFunction](csv, options).then(
                        (function (result){
                            var info;
                            info = this.getResourceFromCSVResult(csv, isFile, result);
                            resolve(info);
                        }).bind(this)
                    ).catch(
                        function(result){
                            reject(result);
                        }
                    )
                }).bind(this)
            );
        },

        getResourceFromFile: function (csvFile, options) {
            return this.getResource(csvFile, true, options);
        },

        getResourceFromUrl: function (csvUrl, options) {
            return this.getResource(csvUrl, false, options);
        }
    }
}

module.exports = new createCSVResourse();