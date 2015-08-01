var $ = require('jquery');
var _ = require('underscore');
var Browser = require('zombie');
var app = require('../datapackagist/app');
var assert = require('chai').assert;
var jtsInfer = require('json-table-schema').infer;

process.env.NODE_ENV = 'test';

Browser.localhost('127.0.0.1', 3000);

describe('DataPackagist core', function() {

  var browser = new Browser({maxWait: 30000});

  // ensure we have time for request to reoslve, etc.
  this.timeout(25000);

  before(function(done) {
    // run the server
    app.listen(3000, function() {
      done();
    });
  });

  describe('Ensure essential form interactions', function() {

    before(function(done) {
      browser.visit('/', done);
    });

    it('is alive', function(done) {
      browser.assert.success();
      done();
    });

    it('has a registry list', function(done) {
      // tests that the registry list exists
      browser.wait({duration: '5s', element: '#registry-list [data-id=list-container] option[value=tabular]'}).then(function() {
        browser.assert.elements('#registry-list [data-id=list-container] option', {atLeast: 2});
        done();
      });
    });

    it('has an upload button', function(done) {
      // tests that the upload button for datapackage.json files exists
      browser.assert.element('#upload-data-package input[type=file]');
      done();
    });

    it('has a download button which is disabled at startup', function(done) {
      // tests that the download button for datapackage.json files exists
      browser.assert.element('#download-data-package[download].disabled');
      done();
    });

    it('constructs the form from the base profile by default', function(done) {
      // tests that the form is built to create a base profile datapackage.json
      browser.wait({duration: '10s'}).then(function() {
        browser.assert.element('#registry-list [data-id=list-container] option[value=base]:selected');
        assert.equal(browser.window.APP.layout.descriptorEdit.layout.form.schema.title, 'DataPackage');
        done();
      });
    });

    it('loads other profiles by route', function(done) {
      // tests that if the correct route is given, then a form is built to create a tabular profile datapackage.json
      browser.visit('/tabular', function() {
        browser.assert.element('#registry-list [data-id=list-container] option[value=tabular]:selected');
        done();

        // request. unpredictably sometimes hang on this URL https://rawgit.com/dataprotocols/schemas/master/tabular-data-package.json
        // Commented out for a while.
        // setTimeout(function() {
        //   assert.equal(browser.window.APP.layout.descriptorEdit.layout.form.schema.title, 'Tabular Data Package');
        //   done();
        // }, 5*1000);
      });
    });

    it('populates on valid descriptor upload', function(done) {
      // can't trigger upload button, thus call the method directly
      browser.window.APP.layout.descriptorEdit.layout.upload.updateApp({name: 'name', title: 'Title'});
      assert.equal(browser.window.$('input[name="root[name]"]').val(), 'name');
      assert.equal(browser.window.$('input[name="root[title]"]').val(), 'Title');
      done();
    });

    it('errors on invalid descriptor upload', function(done) {
      browser.window.APP.layout.descriptorEdit.layout.upload.updateApp({name: 'A'});

      browser.wait({duration: '5s', element: '[data-schemapath="root.name"] .form-group.has-error'}).then(function() {
        browser.assert.element('[data-schemapath="root.name"] .form-group.has-error');
        done();
      });
    });

    it('allows download of valid base profile', function(done) {
      // try to download valid base profile
      browser.visit('/', function() {
        browser.fill('[name="root[name]"]', 'name');

        browser.wait({duration: '5s', element: '#download-data-package:not(.disabled)'}).then(function() {
          assert(!browser.window.$('#download-data-package').hasClass('disabled'), 'Download button not enabled');
          done();
        });
      });
    });

    it('does not allow download of an invalid base profile', function(done) {
      // try to download invalid base profile
      browser.visit('/', function() {
        browser.fill('[name="root[name]"]', 'Invalid name');

        setTimeout(function() {
          assert(browser.window.$('#download-data-package').hasClass('disabled'), 'Download button not disabled');
          done();
        }, 2000);
      });
    });

    it('allows download of valid tabular profile', function(done) {
      // try to download valid tabular profile
      browser.visit('/tabular', function() {
        browser.fill('[name="root[name]"]', 'name');

        // Don't know how to simulate file upload
        browser.window.APP.layout.descriptorEdit.layout.form.getEditor('root.resources').rows[0].setValue({
          name: 'test',
          path: 'test.csv',
          schema: jtsInfer(['name', 'age'], [['John', '33']])
        }, true);

        browser.wait({duration: '5s', element: '#download-data-package:not(.disabled)'}).then(function() {
          assert(!browser.window.$('#download-data-package').hasClass('disabled'), 'Download button not enabled');
          done();
        });
      });
    });

    it('does not allow download of an invalid tabular profile', function(done) {
      // try to download invalid tabular profile
      // try to download invalid base profile
      browser.visit('/tabular', function() {
        browser.fill('[name="root[name]"]', 'Invalid name');

        setTimeout(function() {
          assert(browser.window.$('#download-data-package').hasClass('disabled'), 'Download button not disabled');
          done();
        }, 5000);
      });
    });

  });

  describe('Ensure essential resource file interactions', function() {

    before(function(done) {
      browser.visit('/', done);
    });

    it('has a button to upload a resource file', function(done) {
      // ensure that the button to upload a resource file exists
      browser.assert.element('[data-id=upload-data-file]');
      done();
    });

    it('populates a resource in the resources array when uploading a valid resource', function(done) {
      // ensure that a valid resource file upload results in a new resource object
      browser.visit('/', function() {
        // Don't know how to simulate file upload
        browser.window.APP.layout.descriptorEdit.layout.form.getEditor('root.resources').rows[0].setValue({
          name: 'test',
          path: 'test.csv',
          schema: jtsInfer(['name', 'age'], [['John', '33']])
        }, true);

        assert.equal(browser.window.$('[name="root[resources][0][name]"]').val(), 'test');
        assert.equal(browser.window.$('[name="root[resources][0][path]"]').val(), 'test.csv');
        done();
      });
    });

    it('errors when uploading an invalid resource', function(done) {
      // ensure that when a user attempts to upload an invalid resource, that she is shown an error
      browser.visit('/', function() {
        // Use this for file upload https://github.com/assaf/zombie/blob/master/src/index.js#L875
        browser.wait({duration: '10s', element: '[name="root[resources][0][name]"]'}).then(function() {
          var editor = browser.window.APP.layout.descriptorEdit.layout.form.getEditor('root.resources');
          var schema = jtsInfer(['name', 'age'], [['John', '33', '123asd']]);


          editor.rows[0].setValue({
            name: 'test',
            path: 'test.csv',
            schema: schema
          }, true);

          editor.rows[0].dataSource = {schema: schema, data: 'name,age\nJohn,33,123asd'};
          browser.window.APP.layout.descriptorEdit.layout.form.validateResources();

          browser.wait({duration: '10s'}).then(function() {
            browser.assert.element('[data-schemapath="root.resources.0.schema"] > div > p');
            done();
          });
        });
      });
    });

    it('validates a valid resource on user action', function(done) {
      // ensure that when a user validates one or many valid resources,
      // the resource validation view is shown with a success result
      browser.visit('/', function() {
        var editor = browser.window.APP.layout.descriptorEdit.layout.form.getEditor('root.resources');
        var schema = jtsInfer(['name', 'age'], [['John', '33']]);


        // Don't know how to simulate file upload
        editor.rows[0].setValue({
          name: 'test',
          path: 'test.csv',
          schema: schema
        }, true);

        editor.rows[0].dataSource = {schema: schema, data: 'name,age\nJohn,33'};

        editor.addRow({
          name: 'test',
          path: 'test.csv',
          schema: schema
        }, true);

        editor.rows[1].dataSource = {schema: schema, data: 'name,age\nJane,55'};
        browser.click('#validate-resources');

        browser.wait({duration: '5s', element: '#validation-result:not([hidden])'}).then(function() {
          assert(!browser.window.$('#ok-message').prop('hidden'));
          done();
        });
      });
    });

    it('validates an invalid resource on user action', function(done) {
      // ensure that when a user validates one or many invalid resources,
      // the resource validation view is shown with error results
      browser.visit('/', function() {
        var editor = browser.window.APP.layout.descriptorEdit.layout.form.getEditor('root.resources');
        var schema = jtsInfer(['name', 'age'], [['John', '33']]);


        // Don't know how to simulate file upload
        editor.rows[0].setValue({
          name: 'test',
          path: 'test.csv',
          schema: schema
        }, true);

        editor.rows[0].dataSource = {schema: schema, data: 'name,age\nJohn,33'};

        editor.addRow({
          name: 'test-invalid',
          path: 'test-invalid.csv',
          schema: schema
        }, true);

        editor.rows[1].dataSource = {schema: schema, data: 'name,age\nJane,55,invalid'};
        browser.click('#validate-resources');

        browser.wait({duration: '5s', element: '#validation-result:not([hidden])'}).then(function() {
          assert(browser.window.$('#ok-message').prop('hidden'));
          browser.assert.elements('#validation-result [data-id=errors-list] .result', 1);
          done();
        });
      });
    });

  });

  describe('Ensure From Remote API', function() {

    it('a correct CKAN remote results in a data package', function(done) {
      browser.visit('/tabular/from/?source=ckan&url=http%3A%2F%2Fdatahub.io%2Fapi%2Faction%2Fpackage_show%3Fid%3Dpopulation-number-by-governorate-age-group-and-gender-2010-2014&oq=asdf+http%3A%2F%2Fdatahub.io%2Fapi%2Faction%2Fpackage_show%3Fid%3Dpopulation-number-by-governorate-age-group-and-gender-2010-2014&format=json', function() {
        browser.wait({duration: '10s', element: '[data-schemapath="root.resources.0"]'}).then(function() {
          browser.assert.element('[data-schemapath="root.resources"] [data-schemapath="root.resources.0"]');
          done();
        });
      });
    });

  });

});
