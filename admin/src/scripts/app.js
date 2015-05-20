var backbone = require('backbone');
var BigbangView = require('./components/ui/bigbang');
var Router = require('./router');


window.APP = new BigbangView({el: '#application'});
window.ROUTER = new Router();

window.APP.render();
backbone.history.start({pushState: true});

// A simple example of the datapackages-registry lib
// is given in the registry.get() method (see console).
