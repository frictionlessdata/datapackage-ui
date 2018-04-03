const uuidv4 = require('uuid/v4')
const {Schema} = require('tableschema')
const {Profile} = require('datapackage')
const without = require('lodash/without')
const cloneDeep = require('lodash/cloneDeep')


// State

const INITIAL_STATE = {
  descriptor: {},
  editorType: 'package',
  isPreviewActive: false,
  feedback: false,
}


// Updaters

const UPDATERS = {

  // Package

  UPLOAD_PACKAGE:
    ({}, {payload}) => {
      return {descriptor: payload}
    },

  VALIDATE_PACKAGE:
    ({publicDescriptor}, {}) => {
      const profile = new Profile(publicDescriptor.profile || 'data-package')
      const {valid, errors} = profile.validate(publicDescriptor)
      if (valid) {
        return {
          feedback: {
            type: 'success',
            text: 'Data package is valid!',
          }
        }
      } else {
        return {
          feedback: {
            type: 'danger',
            text: 'Data package is invalid!',
            messages: errors.map((error) => error.message),
          }
        }
      }
    },

  UPDATE_PACKAGE:
    ({descriptor}, {payload}) => {
      return {descriptor: {...descriptor, ...payload}}
    },

  // Resources

  ADD_RESOURCE:
    ({descriptor}, {}) => {
      descriptor = cloneDeep(descriptor)
      descriptor.resources = descriptor.resources
      descriptor.resources.push({})
      return {descriptor}
    },

  REMOVE_RESOURCE:
    ({descriptor, tables}, {resourceIndex}) => {
      descriptor = cloneDeep(descriptor)
      descriptor.resources.splice(resourceIndex, 1)
      return {descriptor, tables}
    },

  UPDATE_RESOURCE:
    ({descriptor}, {resourceIndex, payload}) => {
      descriptor = cloneDeep(descriptor)
      descriptor.resources[resourceIndex] = {
        ...descriptor.resources[resourceIndex],
        ...payload,
      }
      return {descriptor}
    },

  UPLOAD_DATA:
    ({descriptor}, {resourceIndex, headers, rows}) => {
      descriptor = cloneDeep(descriptor)
      const schemaDescriptor = descriptor.resources[resourceIndex].schema

      // Get columns
      const columns = []
      for (const [index, header] of headers.entries()) {
        columns[index] = columns[index] || {header, values: []}
        for (const row of rows) {
          columns[index].values.push(row[index])
        }
      }

      // Infer columns
      for (const column of columns) {
        const schema = new Schema()
        schema.infer(column.values, {headers: [column.header]})
        column.descriptor = schema.descriptor.fields[0]
      }

      // Update descriptor
      schemaDescriptor._columns = columns
      for (const [index, column] of columns.entries()) {
        const field = schemaDescriptor.fields[index]
        if (field) schemaDescriptor.fields[index] = {...field, ...column.descriptor}
      }

      return {descriptor}
    },

  // Schema

  UPDATE_SCHEMA:
    ({descriptor}, {resourceIndex, payload}) => {
      descriptor = cloneDeep(descriptor)
      descriptor.resources[resourceIndex].schema = {
        ...descriptor.resources[resourceIndex].schema,
        ...payload,
      }
    },

  // Fields

  ADD_FIELD:
    ({descriptor}, {resourceIndex, payload}) => {
      descriptor = cloneDeep(descriptor)
      const schemaDescriptor = descriptor.resources[resourceIndex].schema
      schemaDescriptor.fields = schemaDescriptor.fields
      schemaDescriptor.fields.push(payload)
      return {descriptor}
    },

  REMOVE_FIELD:
    ({descriptor}, {resourceIndex, fieldIndex}) => {
      descriptor = cloneDeep(descriptor)
      const schemaDescriptor = descriptor.resources[resourceIndex].schema
      schemaDescriptor.fields.splice(fieldIndex, 1)
      if (schemaDescriptor._columns && schemaDescriptor._columns.length > fieldIndex) {
        schemaDescriptor._columns.splice(fieldIndex, 1)
      }
      return {descriptor}
    },

  UPDATE_FIELD:
    ({descriptor}, {resourceIndex, fieldIndex, payload}) => {
      descriptor = cloneDeep(descriptor)
      const schemaDescriptor = descriptor.resources[resourceIndex].schema
      schemaDescriptor.fields[fieldIndex] = {
        ...schemaDescriptor.fields[fieldIndex],
        ...payload,
      }
      return {descriptor}
    },

  // License

  UPDATE_LICENSE:
    ({descriptor}, {license}) => {
      descriptor = cloneDeep(descriptor)
      descriptor.licenses = descriptor.licenses || []
      if (license !== undefined) {
        descriptor.licenses[0] = {
          ...descriptor.licenses[0],
          ...license
        }
      } else {
        delete descriptor.licenses
      }
      return {descriptor}
    },

  // Contributors

  UPDATE_CONTRIBUTORS:
    ({descriptor}, {contributors}) => {
      descriptor = cloneDeep(descriptor)
      descriptor.contributors = contributors
      return {descriptor}
    },
  // Keywords

  ADD_KEYWORD:
    ({descriptor}, {keyword}) => {
      if (!descriptor.keywords.includes(keyword)) {
        descriptor = cloneDeep(descriptor)
        descriptor.keywords = descriptor.keywords
        descriptor.keywords.push(keyword)
        return {descriptor}
      }
    },

  REMOVE_KEYWORD:
    ({descriptor}, {keyword}) => {
      if (descriptor.keywords) {
        descriptor = cloneDeep(descriptor)
        descriptor.keywords = without(descriptor.keywords, keyword)
        return {descriptor}
      }
    },

  UPDATE_KEYWORD:
    ({descriptor}, {keyword, newKeyword}) => {
      if (descriptor.keywords) {
        descriptor = cloneDeep(descriptor)
        descriptor.keywords[descriptor.keywords.indexOf(keyword)] = newKeyword
        return {descriptor}
      }
    },

  // Interface

  TOGGLE_PREVIEW:
    ({isPreviewActive}, {}) => {
      return {isPreviewActive: !isPreviewActive}
    },

}

// Processor

function processState(state) {

  // Descriptor
  state.descriptor.keywords = state.descriptor.keywords || []
  state.descriptor.resources = state.descriptor.resources || []
  for (const [resourceIndex, resource] of state.descriptor.resources.entries()) {
    resource._key = resource._key || resource.name || uuidv4()
    resource.name = resource.name || `resource${resourceIndex + 1}`
    resource.path = resource.path || ''
    resource.profile = resource.profile || 'tabular-data-resource'
    if (resource.path instanceof Array) {
      resource.path = resource.path[0]
    }
    resource.schema = resource.schema || {}
    resource.schema.fields = resource.schema.fields || []
    resource.schema._columns = resource.schema._columns || []
    for (const [fieldIndex, field] of resource.schema.fields.entries()) {
      field._key = field._key || field.name || uuidv4()
      field.name = field.name || `field${fieldIndex + 1}`
      field.type = field.type || 'string'
      field.format = field.format || 'default'
    }
  }

  // Public descriptor
  state.publicDescriptor = cloneDeep(state.descriptor)
  deleteEmptyProperties(state.publicDescriptor)
  for (const resource of state.publicDescriptor.resources || []) {
    delete resource._key
    delete resource.schema._columns
    if (resource.schema && resource.schema.field) {
      for (const field of resource.schema.fields) {
        delete field._key
      }
    }
  }

  return state

}


function deleteEmptyProperties(obj) {
  // Recursively removes undefined, empty strings, and empty arrays from `obj`
  for (const i in obj) {
    if (obj[i] === undefined || obj[i] === '' || obj[i].length === 0) {
      delete obj[i]
    } else if (typeof obj[i] === 'object') {
      deleteEmptyProperties(obj[i])
    }
  }
}

// Reducers

const createReducer = ({descriptor}) => (state, action) => {
  if (!state) return processState({...INITIAL_STATE, descriptor})
  const updater = UPDATERS[action.type]
  return updater ? processState({...state, ...(updater(state, action) || {})}) : state
}


// System

module.exports = {
  createReducer,
  _processState: processState,
}
