require('./styles/base.css')
require('./styles/mockup.css')
require('./mockup.js')
require('regenerator-runtime/runtime')
const { render } = require('./render')
const { EditorSchema } = require('./components/EditorSchema')
const { EditorPackage } = require('./components/EditorPackage')

// Module API

module.exports = {
  render,
  EditorSchema,
  EditorPackage,
}
