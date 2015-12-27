var _ = require('underscore');
var express = require('express');
var app = express();
var validator = require('validator');
var request_agent = require('request');
var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(__dirname + '/dist'));
app.use('/examples', express.static(__dirname + '/../examples'));


app.all('/download/*', function(req, res) {
  var jsonString = req.body.json;
  console.log('------------------------------------------------');
  res.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment; filename="datapackage.json"' });
  res.write(jsonString);
  res.end();
});

app.get('/cors-proxy/*', function(req, response) {
  var url = req.params[0];

  if(!validator.isURL(url.replace(/ /g, '%20'))) {
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

var port = process.env.PORT || 3000;
app.set('port', port);

module.exports = app;
