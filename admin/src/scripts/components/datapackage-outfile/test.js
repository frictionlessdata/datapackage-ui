var _ = require('underscore');
var assert = require('chai').assert;
var outfile = require('../datapackage-outfile');
var should = require('chai').should();
var VALID_DESCRIPTOR = {title: ''};


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

  it('return proper mime-type', function(done, err) {
    (new RegExp(/^data:application\/json,/)).exec(outfile(VALID_DESCRIPTOR)).should.be.not.empty;
    done();
  });

  it('return proper mime-type if old IE flag passed in params', function(done, err) {
    (new RegExp(/^data:text\/plain,/)).exec(outfile(VALID_DESCRIPTOR, {IE9: true})).should.be.not.empty;
    done();
  });

  it('return a string that evaluates into original descriptor', function() {
    assert.equal(false, true);
    done();
  });
});
