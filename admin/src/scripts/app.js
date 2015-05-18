var backbone = require('backbone');
var BigbangView = require('./components/ui/bigbang');
var registry = require('./components/datapackage-registry');
var Router = require('./router');
var ok = require('./components/ui/ok.js');
var dataPackageProfiles = registry.get();


window.APP = new BigbangView({el: '#application'});
window.ROUTER = new Router();

window.APP.render();
backbone.history.start({pushState: true});

// the logic for the Open Knowledge banner
ok();

// A simple example of the datapackages-registry lib
// is given in the registry.get() method (see console).
