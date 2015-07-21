var $ = require('jquery');
var _ = require('underscore');
var Browser = require('zombie');
var app = require('../datapackagist/app');
var assert = require('chai').assert;

process.env.NODE_ENV = 'test';

Browser.localhost('datapackagist.io', 3000);

describe('DataPackagist core', function() {

  var browser = new Browser({maxWait: 30000});

  // ensure we have time for request to reoslve, etc.
  this.timeout(15000);

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
      browser.assert.elements('#registry-list [data-id=list-container] option', {atLeast: 2});
      done();  
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
      browser.assert.element('#registry-list [data-id=list-container] option[value=base]:selected');
      assert.equal(browser.window.APP.layout.descriptorEdit.layout.form.schema.title, 'DataPackage');
      done();
    });

    it('loads other profiles by route', function(done) {
      // tests that if the correct route is given, then a form is built to create a tabular profile datapackage.json
      browser.visit('/tabular', function() {
        browser.assert.element('#registry-list [data-id=list-container] option[value=tabular]:selected');
        assert.equal(browser.window.APP.layout.descriptorEdit.layout.form.schema.title, 'Tabular Data Package');
        done();
      });
    });

    it('populates on valid descriptor upload', function(done) {
      // upload a valid datapackage.json via upload button
      assert.fail();
      done();
    });

    it('errors on invalid descriptor upload', function(done) {
      // upload an invalid datapackage.json via upload button
      assert.fail();
      done();
    });

    it('allows download of valid base profile', function(done) {
      // try to download valid base profile
      assert.fail();
      done();
    });

    it('does not allow download of an invalid base profile', function(done) {
      // try to download invalid base profile
      assert.fail();
      done();
    });

    it('allows download of valid tabular profile', function(done) {
      // try to download valid tabular profile
      assert.fail();
      done();
    });

    it('does not allow download of an invalid tabular profile', function(done) {
      // try to download invalid tabular profile
      assert.fail();
      done();
    });

  });

  describe('Ensure essential resource file interactions', function() {

    it('has a button to upload a resource file', function(done) {
      // ensure that the button to upload a resource file exists
      assert.fail();
      done();
    });

    it('populates a resource in the resources array when uploading a valid resource', function(done) {
      // ensure that a valid resource file upload results in a new resource object
      assert.fail();
      done();
    });

    it('errors when uploading an invalid resource', function(done) {
      // ensure that when a user attempts to upload an invalid resource, that she is shown an error
      assert.fail();
      done();
    });

    it('validates a valid resource on user action', function(done) {
      // ensure that when a user validates one or many valid resources,
      // the resource validation view is shown with a success result
      assert.fail();
      done();
    });

    it('validates an invalid resource on user action', function(done) {
      // ensure that when a user validates one or many invalid resources,
      // the resource validation view is shown with error results
      assert.fail();
      done();
    });

  });

  describe('Ensure From Remote API', function() {

    it('a correct CKAN remote results in a data package', function(done) {
      assert.fail();
      done();
    });

  });

});
