const cloneDeep = require('lodash/cloneDeep')


// State

const INITIAL_STATE = {
  descriptor: {},
  editorType: 'schema',
  isPreviewActive: false,
  feedback: false,
}


// Updaters

const UPDATERS = {

  // Schema

  UPDATE_SCHEMA:
    ({descriptor}, {resourceIndex}) => {
      const schemaDescriptor = descriptor.resources[resourceIndex].schema
    },

  // Fields

  ADD_FIELD:
    ({descriptor}, {resourceIndex, payload}) => {
      descriptor = cloneDeep(descriptor)
      const schemaDescriptor = descriptor.resources[resourceIndex].schema
      schemaDescriptor.fields = schemaDescriptor.fields || []
      schemaDescriptor.fields.push({
        name: `field${schemaDescriptor.fields.length + 1}`,
        ...payload,
      })
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

}

// Reducers

const createReducer = ({descriptor}) => (state, action) => {
  if (!state) return {...INITIAL_STATE, descriptor}
  const updater =  UPDATERS[action.type]
  return updater ? {...state, ...(updater(state, action) || {})} : state
}


// System

module.exports = {
  createReducer,
  UPDATERS,
}
