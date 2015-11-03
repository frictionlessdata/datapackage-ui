var app = require('./app');

var server = app.listen(app.get('port'), function() {
  console.log('DataPackagist is being served.');
});
