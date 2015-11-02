var _ = require('underscore');
var express = require('express');
var app = express();
var superagent = require('superagent-bluebird-promise');
var validator = require('validator');
var request_agent = require('request');

app.use(express.static(__dirname + '/dist'));

app.get('/cors-proxy/*', function(req, response) {
  var url = req.params[0];

  if(!validator.isURL(url)) {
    response.send('URL you passed is invalid');
    return false;
  }

  var urlParams = '';
  if (!_.isEmpty(req.query)) {
    urlParams = '?' + _.chain(req.query).pairs().map(function(pair) {
        return pair.join('=')
      }).value().join('&')
  }
  req.pipe(request_agent(req.params[0] + urlParams)).pipe(response);
});

app.get('*', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html');
});

app.use(function(req, res) {
  res.status(404).send('This page cannot be found.');
});

module.exports = app;
