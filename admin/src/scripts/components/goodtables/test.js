var chai = require('chai');
var Goodtables = require('./index');
var request = require('superagent');
var should = require('chai').should();
var spies = require('chai-spies');


chai.use(spies);

describe('Goodtables API wrapper', function() {
  var requestConfig = {
    callback: function (match, data) { return {text: data}; },
    fixtures: function (match, params) { return ''; },
    pattern: '.*'
  };


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
    var goodtables;
    var spyGet;
    var spyPost;


    if(err) done(err);

    spyGet = chai.spy.on(request, 'get');
    spyPost = chai.spy.on(request, 'post');
    goodtables = new Goodtables({method: 'get'});

    goodtables.run('data').then(function() {
      goodtables = new Goodtables({method: 'post'});

      goodtables.run('data').then(function() {
        spyGet.should.have.been.called();
        spyPost.should.have.been.called();
        done();
      });
    });

  });

  it('provide default values for all params', function(done, err) {
    if(err) done(err);
    chai.assert(false);
  });

  it('return Promise object', function(done, err) {
    if(err) done(err);
    chai.assert(false);
  });

  it('reject with a message when connection failed', function(done, err){
    if(err) done(err);
    chai.assert(false);
  });
});
