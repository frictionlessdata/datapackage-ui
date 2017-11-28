const React = require('react')
const {Schema} = require('tableschema')
const cloneDeep = require('lodash/cloneDeep')
const {Provider, connect} = require('react-redux')
const {withStateHandlers, lifecycle, compose} = require('recompose')
const {EditorField} = require('./EditorField')


// Components

function EditorSchema({

  // Props
  descriptor,
  resourceIndex,

  // Handlers
  onAddFieldClick,
  onAddAllFieldsClick,

}) {
  const extraColumnsCount = getExtraColumnsCount(descriptor)
  return (
    <div className="data-cards sortable">

      {/* Fields */}
      {(descriptor.fields || []).map((fieldDescriptor, fieldIndex) => (
        <div className="draggable card" id="column_1" key={fieldIndex}>
          <div className="inner">
            <EditorField
              column={((descriptor._columns || [])[fieldIndex]) || {}}
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


// Handlers

const mapDispatchToProps = (dispatch, {descriptor, resourceIndex}) => ({

  onAddFieldClick:
    (ev) => {
      const column = ((descriptor._columns || [])[resourceIndex]) || {}
      dispatch({
        type: 'ADD_FIELD',
        payload: column.descriptor,
        resourceIndex,
      })
    },

  onAddAllFieldsClick:
    (ev) => {
      const fields = descriptor.fields || []
      const columns = descriptor._columns || []
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


// Helpers

function getExtraColumnsCount(descriptor) {
  const columnsCount = (descriptor._columns || []).length
  const fieldsCount = (descriptor.fields || []).length
  return Math.max(columnsCount - fieldsCount, 0)
}


// Wrappers

EditorSchema = connect(null, mapDispatchToProps)(EditorSchema)


// System

module.exports = {
  EditorSchema,
}
