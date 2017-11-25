const React = require('react')
const cloneDeep = require('lodash/cloneDeep')
const {withStateHandlers} = require('recompose')
const {EditorField} = require('./EditorField')


// Module API

function EditorSchema({

  // Props
  descriptor,
  resourceIndex,
  updatePackage,

  // State
  updateSchema,

}) {
  return (
    <div className="data-cards sortable">

      {/* Fields */}
      {(descriptor.fields || []).map((descriptor, index) => (
        <div className="draggable card" id="column_1" key={index}>
          <div className="inner">
            <EditorField
              index={index}
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
              fieldDescriptor: {name: `field${descriptor.fields.length + 1}`}
            })
          }}
        >
          <svg><use xlinkHref="#icon-plus" /></svg> Add item
        </a>
      </div>

    </div>
  )
}


// Internal

const initialState = ({descriptor}) => ({
  descriptor: cloneDeep(descriptor),
})


const updateSchema = ({descriptor}, {resourceIndex, updatePackage}) => (action) => {
  descriptor = {...descriptor}

  // Update schema
  switch (action.type) {

    case 'UPDATE_SCHEMA':
      descriptor = {...descriptor, ...action.descriptor}
      break

    case 'UPDATE_FIELD':
      descriptor.fields[action.fieldIndex] = {
        ...descriptor.fields[action.fieldIndex],
        ...action.fieldDescriptor
      }
      break

    case 'REMOVE_FIELD':
      descriptor.fields.splice(action.fieldIndex, 1)
      break

    case 'ADD_FIELD':
      descriptor.fields.push(action.fieldDescriptor)
      break

  }

  // Update package
  if (updatePackage) {
    updatePackage({
      type: 'UPDATE_RESOURCE',
      resourceIndex,
      resourceDescriptor: {schema: descriptor}
    })
  }

  return {descriptor}
}


// System

module.exports = {
  EditorSchema: withStateHandlers(initialState, {
    updateSchema,
  })(EditorSchema),
}
