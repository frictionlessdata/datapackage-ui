var backbone = require('backbone');
var backboneBase = require('backbone-base');
var registry = require('./components/datapackage-registry');
var Router = require('./router');
var ok = require('./components/ui/ok.js');
var dataPackageProfiles = registry.get();


window.APP = new backbone.BaseView({el: '#application'});
window.ROUTER = new Router();

backbone.history.start({pushState: true});

// the logic for the Open Knowledge banner
ok();

// A simple example of the datapackages-registry lib
// is given in the registry.get() method (see console).
