# Data Packagist

A web app for creating, editing and validating Data Packages.

Data Packagist allows you to:

* Work with any Data Package Profile that has an entry in the [Data Package Registry](https://github.com/dataprotocols/registry)
    * Create a new Data Package
    * Edit an existing Data Package
    * Download your work as a `datapackage.json` descriptor for use elsewhere
* Add additional custom fields to both the top-level descriptor, and each Data Package Resource
* For each Resource in your Data Package, validate that it is well formed, and conforms to a schema
* Automatically infer a schema for each Resource added to the package
* Manually edit the schema for each Resource
* Add existing "remote" data to automatically create a Data Package. CKAN and DKAN currently supported

Use it at:

http://datapackagist.okfnlabs.org/

## Documentation

### Local development

Getting setup for local development is easy. Ensure that you have a recent version of Node.js installed, and follow the following steps.

1. Create your own fork of `https://github.com/okfn/datapackagist`
2. Clone your fork locally with `https://github.com/{YOUR_USERNAME}/datapackagist.git`
3. Install the dependencies with `npm install`
4. Run the server with `npm start`, and visit the app at `http://localhost:3000`

That's it. Other things you can do:

* Run the test suite with `npm test`
* Deploy your own instance with `npm run-script deploy` (WIP - currently only works for those with permissions on the main DataPackagist instance)

### Contributing

We welcome contributions. Please keep the style consistent. Refer to [Open Knowledge Coding Standards](https://github.com/okfn/coding-standards).

In summary, in this codebase we:

* Write all code in Node.js-style Javascript using modules, exports and require, and employ [Browserify]((http://browserify.org/)) to build front end distributions of the code
* Use two spaces for indentation
* Use semi-colons, and import modules with the full `var {name} = require('{name}');` syntax
  * No leading commas in this codebase :)
* Accept pull requests on feature branches (e.g.: `feature/my-feature`), or some similar pattern of branches from the main `master` branch

Also, notice the following conventions:

* All core business logic goes in packages under `src/components` (e.g: the `ui` package).
* Each package should have unit tests.
* All presentation and glue code for the web interface goes under `src/components/ui`.
* A browser-compatible build of the code is generated automatically into `dist`
* We separate the browser scripts to two bundles:
  * `vendor.min.js` has our dependencies
  * `app.min.js` has our code
* Dependencies should be managed in `npm`, and not `bower`. [Add dependencies to this list](https://github.com/okfn/datapackagist/blob/master/gulpfile.js#L24) to include them in `vendor.min.js`

If you are new to some of the tooling we use - don't worry, it is not difficult! Refer to [Node Modules](https://nodejs.org/api/modules.html), [Mocha](http://mochajs.org/), [Chai](http://chaijs.com/), [Browserify](http://browserify.org/), [Gulp](http://gulpjs.com/) and [BrowserSync](http://www.browsersync.io/) for further information. These are all key tools to organizing our code and workflow.

### Integrations

DataPackagist currently exposes a simple, URL-based API to pull remote data into the application and model it to a Data Package.

This functionality is provided by the [datapackage-from-remote](https://github.com/okfn/datapackage-from-remote-js) ([on npm](https://www.npmjs.com/package/datapackage-from-remote)) library, and is currently designed around the use case of taking information from a dataset hosted on CKAN or DKAN and automatically creating a Data Package for it.

Please see the docs of **datapackage-from-remote** for specific information on its API, including features such as adding custom remotes. Here, we'll discuss the API that DataPackagist exposes on top of this for use in the web app.

#### API via query params

DataPackagist supports remote integration via query params on the base URL of the application (e.g.: `http://datapackagist.okfnlabs.org/?{query_params}`).

The following parameters are supported:

* `url`: (**required**) A URL which returns a JSON object describing some data that can be converted to a Data Package.
* `source`: An identifier of the remote source type. This is a string which defaults to `ckan`. DKAN remotes are supported by the CKAN identifier as they expose the same API.
* `version`: The version of the API of the source type. defaults to `3.0`, which is the current CKAN version.
* `datapackage`: An identifier of the Data Package Profile that this remote data should be mapped to. Defaults to `base`, and can be any ID of a Profile in the [Data Package Registry](https://github.com/dataprotocols/registry)

All data passed via params must be url encoded.

#### Integration from 3rd party apps

With knowledge of the supported query params, integration as as simple as making a `GET` request to DataPackagist with the appropriate data.

#### Examples

* Here is a dataset on a CKAN instance: `http://datahub.io/api/action/package_show?id=population-number-by-governorate-age-group-and-gender-2010-2014`
* Here is the same dataset, modeled as a Data Package: `http://datapackagist.okfnlabs.org/?url=http%3A%2F%2Fdatahub.io%2Fapi%2Faction%2Fpackage_show%3Fid%3Dpopulation-number-by-governorate-age-group-and-gender-2010-2014`
* An example integration, as a link: `<a href="http://datapackagist.okfnlabs.org/?url=http%3A%2F%2Fdatahub.io%2Fapi%2Faction%2Fpackage_show%3Fid%3Dpopulation-number-by-governorate-age-group-and-gender-2010-2014&datapackage=tabular">Convert to Tabular Data Package</a>`
