var _ = require('underscore');
var chai = require('chai');
var Goodtables = require('./index');
var Promise = require('promise-polyfill');
var request = require('superagent');
var should = require('chai').should();
var spies = require('chai-spies');
var queryString = require('query-string');


chai.use(spies);

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

    require('superagent-mock')(request, [{
      callback: function (match, data) {
        _.isEqual(queryString.parse(match[0].split('?')[1]), {
          fail_fast        : 'true',
          format           : 'csv',
          ignore_empty_rows: 'false',
          report_limit     : '1000',
          row_limit        : '20000'
        }).should.be.true;

        done();

        return {text: ''};
      },

      fixtures: function (match, params) { return ''; },
      pattern: '.*'
    }]);

    (new Goodtables()).run('data');
  });

  it('return Promise object', function(done, err) {
    if(err) done(err);

    require('superagent-mock')(request, [{
      callback: function (match, data) { return {text: ''}; },
      fixtures: function (match, params) { return ''; },
      pattern: '.*'
    }]);

    (new Goodtables()).run('data').should.be.an.instanceOf(Promise);
    done();
  });

  it('reject with a message when connection failed', function(done, err) {
    if(err) done(err);

    require('superagent-mock')(request, [{
      callback: function(){ throw new Error(500); },
      fixtures: function (match, params) { return ''; },
      pattern: '.*'
    }]);

    (new Goodtables()).run('data').catch(function(E) { E.should.be.a('string'); done(); });
  });
});
