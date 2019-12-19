require('./styles/base.css')
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
