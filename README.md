# datapackage-ui

[![Travis](https://img.shields.io/travis/frictionlessdata/datapackage-ui/master.svg)](https://travis-ci.org/frictionlessdata/datapackage-ui)
[![Coveralls](https://coveralls.io/repos/github/frictionlessdata/datapackage-ui/badge.svg?branch=master)](https://coveralls.io/github/frictionlessdata/datapackage-ui?branch=master)
[![NPM](https://img.shields.io/npm/v/datapackage-ui.svg)](https://www.npmjs.com/package/datapackage-ui)
[![Github](https://img.shields.io/badge/github-master-brightgreen)](https://github.com/frictionlessdata/datapackage-ui)
[![Gitter](https://img.shields.io/gitter/room/frictionlessdata/chat.svg)](https://gitter.im/frictionlessdata/chat)

UI for `datapackage` as a framework-agnostic browser components ([DEMO](https://frictionlessdata.github.io/datapackage-ui/)).

## Features

- `render` - framework-agnostic component render
- List of components: TBD

## Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Documentation](#documentation)
  - [React](#react)
  - [Angular](#angular)
  - [Vue](#vue)
- [API Reference](#api-reference)
  - [render(component, props, element)](#rendercomponent-props-element)
- [Contributing](#contributing)
- [Changelog](#changelog)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started

You could use this components in plain JavaScript code or mixing with any modern framework (with native support for React). To render `report` you have use `datapackageUI.render(datapackageUI.<Component>, props, element)` function.

First add bootstrap and component styles:

```html
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <link rel="stylesheet" href="//unpkg.com/datapackage-ui/dist/datapackage-ui.min.css">
```

### Installation

#### NPM

> Install the package in your terminal `$ npm install --save datapackage-ui`

The package could be used as `datapackage-ui` package from NPM:

```javascript
import datapackageUI from 'datapackage-ui'

const props = '<YOUR-PROPS>'
const element = document.getElementById('component')
datapackageUI.render(datapackageUI.Component, {...props}, element)
```

#### CDN

> The distribution is 60kb minified (20kb gzipped) with no dependencies.

The package could be used as pluggable script from CDN:

```html
<div id="report"></div>
<script src="//unpkg.com/datapackage-ui/dist/datapackage-ui.min.js"></script>
<script>
  var props = '<YOUR-PROPS>'
  var element = document.getElementById('component')
  datapackageUI.render(datapackageUI.Component, {...props}, element)
</script>
```

## Documentation

### React

> In this case your application should provide `react` and `react-dom`.

You could use presented components as native React component (import from `datapackage-ui/lib` to get native React support):

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import datapackageUI from 'datapackage-ui/lib'

const props = '<YOUR-PROPS>'
const element = document.getElementById('component')
ReactDOM.render(<datapackageUI.Component ...props />, element)
```

### Angular

> This example is for Angular2+. Use similliar approach for Angular1.

The package's components could be used as `angular` component:

```javascript
import {Component, Input} from '@angular/core';
import datapackageUI from 'datapackageUI'

@Component({
  selector: 'component',
  template: '<div id="component"></div>'
})
class Report {
  @Input() <YOUR_PROPS>: any;
  ngAfterViewInit() {
    const element = document.getElementById('component')
    datapackageUI.render(datapackageUI.Component, {...this.props}, element)
  }
}
```

### Vue

> This example is for Vue2+. Use similar approach for Vue1.

The package's components could be used as `vue` component:

```javascript
import datapackageUI from 'datapackageUI'

const Report = {
  props: [<YOUR_PROPS>],
  template: '<div id="component"></div>',
  mounted() {
    const element = document.getElementById('component')
    datapackageUI.render(datapackageUI.Report, {...this.props}, element)
  },
}
```

## API Reference

### render(component, props, element)
Render component


| Param | Type | Description |
| --- | --- | --- |
| component | <code>Component</code> | it could be one of provided by the library component |
| props | <code>Object</code> | object containing props |
| element | <code>Element</code> | DOM element to render into |


## Contributing

> The project follows the [Open Knowledge International coding standards](https://github.com/okfn/coding-standards). There are common commands to work with the project:

```bash
$ npm run dev
$ npm run build
$ npm run test
```

## Changelog

Here described only breaking and the most important changes. The full changelog and documentation for all released versions could be found in nicely formatted [commit history](https://github.com/frictionlessdata/datapackage-ui/commits/master).

#### v1.0

- Initial release of the library
