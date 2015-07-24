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

Use it at: http://datapackagist.okfnlabs.org/

## Documentation

### Using the web app

#### Overview

DataPackagist is a web app that allows you to create and edit Data Packages via a simple and intuitive web form. You can start from scratch, upload an existing `datapackage.json`, or even access DataPackagist via the CKAN and DKAN integration, to get started.

To use the app, you don't need to know the technical details of what a `datapackage.json` file looks like, or why it looks like it does. You only need to know:

1. How to add and edit data in a standard web form.
2. How to upload files via standard web form buttons.
3. How to download files via standard web form buttons.
4. How to find any downloaded `datapackage.json` files, and take them for further use. For example, to add them to new or existing resources on CKAN or DKAN.

#### Scenarios

##### Starting from scratch

In this scenario, you may have some files of data on your local computer that you know you want to use as a Data Package.

The steps are as follows:

1. Use the form to fill out the information for your data package.
2. Of particular note, in the **Resources** section of the form, upload the data files that are to be included in your new Data Package
3. If the data files you add are found to have errors, you will be notified.
4. When you are done, click "Download Data Package" to save your changes to your local machine.
5. Take the newly saved `datapackage.json` file, and the resources that you added as part of the Data Package, and place them together in a single folder on your local computer. You've now got a Data Package!

##### Edit an existing `datapackage.json`

In this scenario, you may have an existing Data Package on your computer, but you need to make changes to it by editing the `datapackage.json` file.

The steps are as follows:

1. On the main page of the DataPackagist web app, click the "Upload" button.
2. Locate the `datapackage.json` file that you wish to edit.
3. Once the `datapackage.json` file is uploaded, the web form will automatically be updated with the current data.
4. Make any required changes to the data in the web form.
5. When you are done, click "Download Data Package" to save your changes to your local machine.
6. Take the newly saved `datapackage.json` file and replace your previous one with it.

##### Using DataPackagist via a link from CKAN or DKAN

In this scenario, you may be viewing or managing datasets on CKAN or DKAN, and need to create or edit a Data Package from a dataset.

The steps are as follows:

1. On the web page of the dataset, you will see a link with a call to action like "Edit in DataPackagist"
2. This link will take you to the DataPackagist web app, where the web form will be automatically populated with the data of the dataset.
3. Make any required changes to the data in the web form.
4. When you are done, click "Download Data Package" to save your changes to your local machine.
5. Take the newly saved `datapackage.json` file and integrate it back with the CKAN or DKAN resource.

### Local development

#### Getting started

Getting setup for local development is easy. We use [io.js](https://iojs.org/), and [nvm](https://github.com/creationix/nvm) for managing multiple node versions locally.

1. On Mac OS X, install nvm: `brew install nvm`. Note the setup requires some additions to your shell config.
2. Install iojs with nvm: `nvm install iojs` (now that you have nvm, you can also install the latest Node version with it: `nvm install stable`).
3. Use a node version with nvm's `use`. We want io.js, so: `nvm use iojs`
4. Tip: you can always check the version you are running with `nvm current`
5. Tip: If, after installing `nvm` and `iojs`, you experience issues with v8flags when running gulp, [see here](https://github.com/gulpjs/gulp/issues/873#issuecomment-75615249).

Once we have our base environment setup to use io.js, then you can configure the actual app:

1. Create your own fork of `https://github.com/okfn/datapackagist`
2. Clone your fork locally with `https://github.com/{YOUR_USERNAME}/datapackagist.git`
3. Install the dependencies with `npm install`
4. Run the server with `npm start`, and visit the app at `http://localhost:3000`

That's it. Other things you can do:

* Run the test suite with `npm test`
* Deploy your own instance with `npm run-script deploy` (WIP - currently only works for those with permissions on the main DataPackagist instance)

#### Contributing

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

#### Default Data Package Profile

By default, DataPackagist loads the form for the base Data Package specification. The user can select another Profile via a drop-down menu.

It is also possible to set another profile via the URL route: the first argument of the URL route should be the ID of a Data Package Profile in the [Data Package Registry](https://github.com/dataprotocols/registry).

Examples:

```
http://datapackagist.okfnlabs.org/#/{PROFILE_ID}/

http://datapackagist.okfnlabs.org/#/base/ (also default - the base Data Package specification)

http://datapackagist.okfnlabs.org/#/tabular/ (The Tabular Data Package specification)
```

#### Adding custom Data Package Profiles

The Data Package Registry currently features entries for the `base` and `tabular` Data Package Profiles.

Adding additional profiles to DataPackagist is as simple as adding new entries to the registry.

Let's demonstrate by example. If you wanted a modified version of Tabular Data Package - say, one that required more fields. The steps would be:

* Create a JSON Schema file for the new spec. [Existing spec schemas here](https://github.com/dataprotocols/schemas)
* Add a new entry to the Registry via a pull request. [Instructions here](https://github.com/dataprotocols/registry)
* When the pull request is accepted, it will immediately be available in DataPackagist. If we called our new profile "tabular-strict", we'd be able to create data packages for it at http://datapackagist.okfnlabs.org/tabular-strict/

#### Integrations

DataPackagist currently exposes a simple, URL-based API to pull remote data into the application and model it to a Data Package.

This functionality is provided by the [datapackage-from-remote](https://github.com/okfn/datapackage-from-remote-js) ([on npm](https://www.npmjs.com/package/datapackage-from-remote)) library, and is currently designed around the use case of taking information from a dataset hosted on CKAN or DKAN and automatically creating a Data Package for it.

Please see the docs of **datapackage-from-remote** for specific information on its API, including features such as adding custom remotes. Here, we'll discuss the API that DataPackagist exposes on top of this for use in the web app.

##### API via query params

DataPackagist supports remote integration via query params on the base URL of the application (e.g.: `http://datapackagist.okfnlabs.org/?{query_params}`).

The following parameters are supported:

* `url`: (**required**) A URL which returns a JSON object describing some data that can be converted to a Data Package.
* `source`: An identifier of the remote source type. This is a string which defaults to `ckan`. DKAN remotes are supported by the CKAN identifier as they expose the same API.
* `version`: The version of the API of the source type. defaults to `3.0`, which is the current CKAN version.
* `datapackage`: An identifier of the Data Package Profile that this remote data should be mapped to. Defaults to `base`, and can be any ID of a Profile in the [Data Package Registry](https://github.com/dataprotocols/registry)

All data passed via params must be url encoded.

Note that this integration also works with the API for setting the displayed Data Package Profile on the form.

As stated above, this is the first URL route argument, which should be the ID of a Data Package Profile in the Data Package Registry.

##### Integration from 3rd party apps

With knowledge of the supported query params, integration as as simple as making a `GET` request to DataPackagist with the appropriate data.

##### Examples

* Here is a dataset on a CKAN instance: `http://datahub.io/api/action/package_show?id=population-number-by-governorate-age-group-and-gender-2010-2014`
* Here is the same dataset, modeled as a Tabular Data Package: `http://datapackagist.okfnlabs.org/#/base/from/?url=http%3A%2F%2Fdatahub.io%2Fapi%2Faction%2Fpackage_show%3Fid%3Dpopulation-number-by-governorate-age-group-and-gender-2010-2014`
* An example integration, as a link: `<a href="http://datapackagist.okfnlabs.org/#/base/from/?url=http%3A%2F%2Fdatahub.io%2Fapi%2Faction%2Fpackage_show%3Fid%3Dpopulation-number-by-governorate-age-group-and-gender-2010-2014">Convert to Data Package</a>`
