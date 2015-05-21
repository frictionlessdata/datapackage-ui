var _ = require('underscore');
var request = require('superagent');
var assert = require('chai').assert;
var Promise = require('promise-polyfill');
var registry = require('../datapackage-registry');
var should = require('chai').should();


describe('Data Package Registry', function(){
  var requestConfig = {
    callback: function (match, data) { return {text: data}; },
    fixtures: function() { return ''; },

    // datapackage-registry doesn't export registry URL
    pattern: '.*'
  };

  describe('get()', function(){
    it('return Promise object', function(done, err){
      if (err) done(err);
      require('superagent-mock')(request, [requestConfig]);
      registry.get().should.be.an.instanceOf(Promise);
      done();
    });

    it('resolve into non-empty array of objects when registry is not empty', function(done, err){
      if (err) done(err);

      require('superagent-mock')(request, [_.extend(requestConfig, {
        fixtures: function(){ return 'id,title,schema,specification\n1,2,3,4'; }
      })]);

      registry.get().then(function(data) {
        data.should.be.not.empty;
        done();
      });
    });

    it('resolve into empty array when registry is empty', function(done, err){
      if (err) done(err);

      require('superagent-mock')(request, [_.extend(requestConfig, {
        fixtures: function(){ return ' '; }
      })]);

      registry.get().then(function(data) {
        data.should.be.empty;

        require('superagent-mock')(request, [_.extend(requestConfig, {
          fixtures: function(){ return 'id,title,schema,specification'; }
        })]);

        // Feel lack of experience in async testing
        registry.get().then(function(data) {
          data.should.be.empty;
          done();
        });
      });
    });

    it('reject with a message when connection failed', function(done, err){
      if (err) done(err);

      require('superagent-mock')(request, [_.extend(requestConfig, {
        callback: function(){ throw new Error(500); }
      })]);

      registry.get().catch(function(error) {
        error.should.be.a('string');
        done();
      });
    });
  });
});
