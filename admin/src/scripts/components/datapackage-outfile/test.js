var _ = require('underscore');
var assert = require('chai').assert;
var outfile = require('../datapackage-outfile');
var should = require('chai').should();

describe('Data Package Output File', function() {
  it('throw error if empty descriptor passed', function(done, err) {
    if (err) done(err);

    try {
      outfile({});
    } catch(exception) {
      exception.message.should.be.not.empty;
      exception.message.should.be.a('string');
      done();
      return;
    }

    done('Exception not thrown');
  });

  it('throw error if non-object passed as a descriptor', function(done, err) {
    if (err) done(err);

    try {
      outfile(123);
    } catch(exception) {
      exception.message.should.be.not.empty;
      exception.message.should.be.a('string');
      done();
      return;
    }

    done('Exception not thrown');
  });

  it('throw error if required properties are missed in a descriptor', function() {
    assert.equal(false, true);
    done();
  });

  it('return all required headers', function() {
    assert.equal(false, true);
    done();
  });

  it('return correct file size', function() {
    assert.equal(false, true);
    done();
  });

  it('return a string that evaluates into original descriptor', function() {
    assert.equal(false, true);
    done();
  });

});
