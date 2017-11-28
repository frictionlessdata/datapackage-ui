const {Schema} = require('tableschema')
const {Profile} = require('datapackage')
const without = require('lodash/without')
const cloneDeep = require('lodash/cloneDeep')
const SCHEMA_UPDATERS = require('./editorSchema').UPDATERS


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
    ({descriptor}, {}) => {
      // TODO: rebase on datapackage.validate
      const profile = new Profile(descriptor.profile || 'data-package')
      const {valid, errors} = profile.validate(descriptor)
      if (valid) {
        return {feedback: {
          type: 'success',
          text: 'Data package is valid!',
        }}
      } else {
        return {feedback: {
          type: 'danger',
          text: 'Data package is invalid!',
          messages: errors.map((error) => error.message),
        }}
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
      descriptor.resources = descriptor.resources || []
      descriptor.resources.push({
        name: `resource${descriptor.resources.length + 1}`,
      })
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

  // Keywords

  ADD_KEYWORD:
    ({descriptor}, {keyword}) => {
      descriptor = cloneDeep(descriptor)
      descriptor.keywords = descriptor.keywords || []
      descriptor.keywords.push(keyword)
      return {descriptor}
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


// Reducers

const createReducer = ({descriptor}) => (state, action) => {
  if (!state) return {...INITIAL_STATE, descriptor}
  const updater =  UPDATERS[action.type] || SCHEMA_UPDATERS[action.type]
  return updater ? {...state, ...(updater(state, action) || {})} : state
}


// System

module.exports = {
  createReducer,
}
