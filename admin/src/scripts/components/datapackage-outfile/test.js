var _ = require('underscore');
var assert = require('chai').assert;
var outfile = require('../datapackage-outfile');
var should = require('chai').should();

var VALID_DESCRIPTOR = {
  'name': 'my-dataset',
  
  'resources': [{
    'path': 'data.csv',

    'schema': {
      'fields': [
        {'name': 'var1', 'type': 'string'},
        {'name': 'var2', 'type': 'integer'},
        {'name': 'var3', 'type': 'number'}
      ]
    }
  }]
};


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

  it('return proper mime-type', function(done, err) {
    if (err) done(err);
    
    (new RegExp(/^data:application\/json:/)).exec(outfile(VALID_DESCRIPTOR)).should.be.not.empty;
    done();
  });

  it('return proper mime-type if old IE flag passed in params', function(done, err) {
    if (err) done(err);
    
    (new RegExp(/^data:text\/plain:/)).exec(
      outfile(VALID_DESCRIPTOR, {IE9: true})
    ).should.be.not.empty;

    done();
  });

  it('return charset passed in options', function(done, err) {
    var charset = 'CHRSET';
    

    if (err) done(err);
    
    (new RegExp('^data:application\/json:' + charset + ',')).exec(
      outfile(VALID_DESCRIPTOR, {charset: charset})
    ).should.be.not.empty;

    done();
  });

  it('return utf-8 as default charset if none passed in options', function(done, err) {
    if (err) done(err);
    
    (new RegExp('^data:application\/json:utf-8,')).exec(
      outfile(VALID_DESCRIPTOR)
    ).should.be.not.empty;

    done();
  });

  it('return a string that evaluates into original descriptor', function(done, err) {
    if (err) done(err);

    JSON.parse(outfile(VALID_DESCRIPTOR).replace(/^[^{]+,/, '')).should.deep.equal(VALID_DESCRIPTOR);
    JSON.parse(outfile(VALID_DESCRIPTOR, {IE9: true}).replace(/^[^{]+,/, '')).should.deep.equal(VALID_DESCRIPTOR);
    JSON.parse(outfile(VALID_DESCRIPTOR, {charset: 'CHRST'}).replace(/^[^{]+,/, '')).should.deep.equal(VALID_DESCRIPTOR);
    JSON.parse(outfile(VALID_DESCRIPTOR, {IE9: true, charset: 'CHRST'}).replace(/^[^{]+,/, '')).should.deep.equal(VALID_DESCRIPTOR);
    done();
  });
});
