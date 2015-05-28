var _ = require('underscore');
var assert = require('chai').assert;
var Goodtables = require('./index');
var should = require('chai').should();


describe('Goodtables API wrapper', function() {
  it('throw error if data file is not passed in params', function(done, err) {
    if(err) done(err);
    
    try {
      (new Goodtables()).run();
    } catch(exception) {
      exception.message.should.be.not.empty;
      exception.message.should.be.a('string');
      done();
      return;
    }

    done('Exception not thrown');
  });

  it('respect passed param for request method', function(done, err) {
    if(err) done(err);
    assert(false);
  });

  it('provide default values for all params', function(done, err) {
    if(err) done(err);
    assert(false);
  });

  it('return Promise object', function(done, err) {
    if(err) done(err);
    assert(false);
  });

  it('reject with a message when connection failed', function(done, err){
    if(err) done(err);
    assert(false);
  });
});
