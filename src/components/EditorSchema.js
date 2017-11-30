const React = require('react')
const {Schema} = require('tableschema')
const {withProps} = require('recompose')
const cloneDeep = require('lodash/cloneDeep')
const {Provider, connect} = require('react-redux')
const {EditorField} = require('./EditorField')


// Components

function EditorSchema({

  // Props
  descriptor,
  resourceIndex,

  // Computed
  extraColumnsCount,

  // Handlers
  onAddFieldClick,
  onAddAllFieldsClick,

}) {
  return (
    <div className="data-cards sortable">

      {/* Fields */}
      {descriptor.fields.map((fieldDescriptor, fieldIndex) => (
        <div className="draggable card" key={fieldDescriptor.name || `field${fieldIndex}`}>
          <div className="inner">
            <EditorField
              column={descriptor._columns[fieldIndex]}
              resourceIndex={resourceIndex}
              fieldIndex={fieldIndex}
              descriptor={fieldDescriptor}
            />
          </div>
        </div>
      ))}

      {/* Add all fields */}
      {!!extraColumnsCount &&
        <div className="add card">
          <a className="inner" onClick={onAddAllFieldsClick}>
            <svg><use xlinkHref="#icon-plus" /></svg> Add all inferred fields
            {!!extraColumnsCount > 0 &&
              <p>{`(data has ${extraColumnsCount} extra column(s))`}</p>
            }
          </a>
        </div>
      }

      {/* Add field */}
      <div className="add card">
        <a className="inner" onClick={onAddFieldClick}>
          <svg><use xlinkHref="#icon-plus" /></svg> Add field
        </a>
      </div>

    </div>
  )
}


// Computers

function computeProps({descriptor}) {

  // Normalize descriptor
  descriptor.fields = descriptor.fields || []
  descriptor._columns = descriptor._columns || []

  // Get extra columns count
  const fieldsCount = descriptor.fields.length
  const columnsCount = descriptor._columns.length
  const extraColumnsCount = Math.max(columnsCount - fieldsCount, 0)

  return {descriptor, extraColumnsCount}
}


// Handlers

const mapDispatchToProps = (dispatch, {descriptor, resourceIndex}) => ({

  onAddFieldClick:
    (ev) => {
      const column = descriptor._columns[descriptor.fields.length] || {}
      dispatch({
        type: 'ADD_FIELD',
        payload: column.descriptor,
        resourceIndex,
      })
    },

  onAddAllFieldsClick:
    (ev) => {
      const fields = descriptor.fields
      const columns = descriptor._columns
      for (const [index, column] of (columns.entries())) {
        if (!fields[index]) {
          dispatch({
            type: 'ADD_FIELD',
            payload: column.descriptor,
            resourceIndex,
          })
        }
      }
    },

})


// Wrappers

EditorSchema = connect(null, mapDispatchToProps)(EditorSchema)
EditorSchema = withProps(computeProps)(EditorSchema)


// System

module.exports = {
  EditorSchema,
}
