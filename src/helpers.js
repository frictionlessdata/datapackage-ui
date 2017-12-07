// Module API

function stringifyDescriptor(descriptor) {
  return JSON.stringify(descriptor, null, 2)
}


// System

module.exports = {
  stringifyDescriptor,
}
