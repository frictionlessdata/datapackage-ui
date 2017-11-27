const React = require('react')
const {Schema} = require('tableschema')
const cloneDeep = require('lodash/cloneDeep')
const {withStateHandlers, lifecycle, compose} = require('recompose')
const {EditorField} = require('./EditorField')


// Module API

function EditorSchema({

  // Props
  table,
  descriptor,
  resourceIndex,
  updatePackage,

  // State
  // descriptor,

  // Handlers
  updateSchema,

}) {
  const columns = getColumns(table)
  const extraColumns = columns.length - (descriptor.fields || []).length
  return (
    <div className="data-cards sortable">

      {/* Fields */}
      {(descriptor.fields || []).map((descriptor, index) => (
        <div className="draggable card" id="column_1" key={index}>
          <div className="inner">
            <EditorField
              index={index}
              column={columns[index] || []}
              descriptor={descriptor}
              updateSchema={updateSchema}
            />
          </div>
        </div>
      ))}

      {/* Add field */}
      <div className="add card">
        <a
          className="inner"
          onClick={(event) => {
            updateSchema({
              type: 'ADD_FIELD',
              fieldDescriptor: {name: `field${(descriptor.fields || []).length + 1}`}
            })
          }}
        >
          <svg><use xlinkHref="#icon-plus" /></svg> Add field
          {extraColumns > 0 &&
            <p>{`(data has ${extraColumns} extra column(s)`}</p>
          }
        </a>
      </div>

    </div>
  )
}


// State

const initialState = ({schemaDescriptor}) => ({
  // descriptor: cloneDeep(schemaDescriptor),
})


const updateSchema = ({/*descriptor*/}, {table, descriptor, resourceIndex, updatePackage}) => (action) => {
  descriptor = {...descriptor}

  // Update package
  const updateSchemaInPackage = (schemaDescriptor) => {
    if (updatePackage) {
      updatePackage({
        type: 'UPDATE_RESOURCE',
        resourceIndex,
        resourceDescriptor: {schema: schemaDescriptor}
      })
    }
  }

  // Update schema
  switch (action.type) {

    case 'UPDATE_SCHEMA':
      descriptor = {...descriptor, ...action.descriptor}
      updateSchemaInPackage(descriptor)
      // return {descriptor}
      break

    case 'UPDATE_FIELD':
      descriptor.fields[action.fieldIndex] = {
        ...descriptor.fields[action.fieldIndex],
        ...action.fieldDescriptor
      }
      updateSchemaInPackage(descriptor)
      // return {descriptor}
      break

    case 'REMOVE_FIELD':
      descriptor.fields.splice(action.fieldIndex, 1)
      updateSchemaInPackage(descriptor)
      // return {descriptor}
      break

    case 'ADD_FIELD':
      descriptor.fields = descriptor.fields || []

      // Infer
      const columns = getColumns(table)
      const column = columns[descriptor.fields.length]
      if (column) {
        const schema = new Schema()
        schema.infer(column, {headers: [action.fieldDescriptor.name]})
        action.fieldDescriptor.type = schema.descriptor.fields[0].type
        action.fieldDescriptor.format = schema.descriptor.fields[0].format
      }

      // Add
      descriptor.fields.push(action.fieldDescriptor)
      updateSchemaInPackage(descriptor)
      // return {descriptor}
      break

  }
}

// Helpers

function getColumns(table) {
  const columns = []
  if (table && !table.read) {
    for (const row of table) {
      for (const [index, value] of row.entries()) {
        columns[index] = columns[index] || []
        columns[index].push(value)
      }
    }
  }
  return columns
}


// System

module.exports = {
  EditorSchema: withStateHandlers(initialState, {
    updateSchema,
  })(EditorSchema),
}
