const cloneDeep = require('lodash/cloneDeep')
const isPlainObject = require('lodash/isPlainObject')


// Module API

function importDescriptor(descriptor) {
  // TODO: write function to normalize input descriptor
}


function exportDescriptor(descriptor) {
  descriptor = cloneDeep(descriptor)
  for (const resource of (descriptor.resources || [])) {
    if (resource.schema) {
      delete resource.schema._columns
    }
  }
  return descriptor
}


// System

module.exports = {
  importDescriptor,
  exportDescriptor,
}
