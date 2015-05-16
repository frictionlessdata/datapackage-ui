var registry = require('./components/datapackage-registry');
var ok = require('./components/ui/ok.js');
var dataPackageProfiles = registry.get();


// the logic for the Open Knowledge banner
ok();

// A simple example of the datapackages-registry lib
// is given in the registry.get() method (see console).
