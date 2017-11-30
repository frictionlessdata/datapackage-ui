const cloneDeep = require('lodash/cloneDeep')
const isPlainObject = require('lodash/isPlainObject')


// Module API

function stringifyDescriptor(descriptor) {

  // Clean from internal props
  descriptor = cloneDeep(descriptor)
  for (const resource of (descriptor.resources || [])) {
    if (resource.schema) {
      delete resource.schema._columns
    }
  }

  return JSON.stringify(descriptor, null, 2)
}


// System

module.exports = {
  stringifyDescriptor,
}
