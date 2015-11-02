var backbone = require('backbone');
var BigbangView = require('./components/ui/bigbang');
var Router = require('./router');

window.APP = new BigbangView({el: '#application'});
window.ROUTER = new Router();

window.APP.render();
backbone.history.start({pushState: true});
