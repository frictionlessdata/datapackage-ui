var _ = require('underscore');
var express = require('express');
var app = express();
var superagent = require('superagent-bluebird-promise');
var validator = require('validator');

app.use(express.static(__dirname + '/dist'));
app.use('/examples', express.static(__dirname + '/../examples'));

app.get('/cors-proxy/*', function(request, response) {
  var url = request.params[0];

  if(!validator.isURL(url)) {
    response.send('URL you passed is invalid');
    return false;
  }

  var urlParams = '';
  if (!_.isEmpty(request.query)) {
    urlParams = '?' + _.chain(request.query).pairs().map(function(pair) {
        return pair.join('=')
      }).value().join('&')
  }
  superagent.get(request.params[0] + urlParams).then(function(data) {
    var contentType = data.header['content-type'];

    var headers = {
      'access-control-allow-origin': '*'
    };
    if (contentType) {
      headers = _.extend(headers, {
        'content-type': contentType
      });
    }
    response
      .set(headers)
      .send(data.text);
  });
});

app.get('*', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html');
});

app.use(function(req, res) {
  res.status(404).send('This page cannot be found.');
});

var port = process.env.PORT || 3000;
app.set('port', port);

module.exports = app;
