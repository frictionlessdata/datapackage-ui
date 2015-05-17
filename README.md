# Data Packagist

A web app for creating, editing and validating Data Packages.

Data Packagist allows you to:

* Work with any Data Package Profile that has an entry in the [Data Package Registry](https://github.com/dataprotocols/registry)
    * Create a new Data Package
    * Edit an existing Data Package
    * Download your work as a `datapackage.json` descriptor for use elsewhere
* Add additional custom fields to both the top-level descriptor, and each Data Package Resource
* For each Resource in your Data Package, validate that it is well formed, and conforms to a schema

Use it at:

http://datapackagist.okfnlabs.org/

## Get Started

First, fork the code in GitHub.

```
# get the code
git clone https://github.com/{YOUR_USERNAME}/datapackagist.git .

# install the dependencies
npm install

# run the server
gulp

# deploy the app
gulp deploy

# run the tests
mocha
```

## Style guide

* Use 2 spaces for indentation

## Workflow

### Writing code

* All code should be written in Node-style JS using modules, exports, require and so on for organization, and live in the `src` directory
* All core business logic goes in packages under `src/components` (e.g: the `datapackage-registry` package). These packages will eventually be broken out and published via npm
* Each package should have unit tests. An example can be found in `datapackage-registry`, using the Mocha and Chai libraries.
* All presentation and glue code for the web interface goes under `src/components/ui`. This should only be code that belongs to the web implementation
* A browser-compatible build of the code is generated automatically into `dist`
* We separate the browser scripts to two bundles: `vendor.min.js` has our dependencies, and `app.min.js` has our code
* Dependencies should be managed in `npm`, and not `bower`. [Add dependencies to this list](https://github.com/okfn/datapackagist/blob/master/gulpfile.js#L23) to include them in `vendor.min.js`
* In general, spend some time understanding our [`gulpfile.js`](https://github.com/okfn/datapackagist/blob/master/gulpfile.js), and all the build/serve tasks are defined there.
* See: [Node Modules](https://nodejs.org/api/modules.html), [Mocha](http://mochajs.org/), [Chai](http://chaijs.com/), [Browserify](http://browserify.org/), [Gulp](http://gulpjs.com/) and [BrowserSync](http://www.browsersync.io/). These are all key tools to organizing our code and workflow.


### Managing code

* Work in your own fork of the code, create branches for your work (as logical), and make pull requests for acceptance of tasks/issues.
* Prefer Git Flow conventions, so, for example: "feature/datapackage-form", and so on


## Other

Disable Web security in Chrome for local CORS:

```
# Mac OS X
open /Applications/Google\ Chrome.app --args --disable-web-security
```
