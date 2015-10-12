var _ = require('underscore');
var express = require('express');
var app = express();
var superagent = require('superagent-bluebird-promise');


app.use(express.static(__dirname + '/dist'));

app.get('/cors-proxy/*', function(request, response) {
  superagent.get(request.params[0] + (
    !_.isEmpty(request.query)
    ? ('?' + _.chain(request.query).pairs().map(function(P) { return P.join('=') }).value().join('&'))
    : ''
  )).then(function(data) {
    response
      .set({'content-type': data.header['content-type']})
      .send(data.text);
  });
});

app.get('*', function(request, response) { response.sendFile(__dirname + '/dist/index.html'); });
module.exports = app;
