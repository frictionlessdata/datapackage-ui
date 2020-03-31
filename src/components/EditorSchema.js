const React = require('react')
const { withProps } = require('recompose')
const { connect } = require('react-redux')
const { EditorField } = require('./EditorField')

// Pure components

function EditorSchemaPure({
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
        <div className="draggable card" key={fieldDescriptor._key}>
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
      {extraColumnsCount > 0 && (
        <div className="add card">
          <button className="inner" onClick={onAddAllFieldsClick}>
            <svg>
              <use xlinkHref="#icon-plus" />
            </svg>{' '}
            Add all inferred fields
            {extraColumnsCount > 0 && <p>{`(data has ${extraColumnsCount} extra column(s))`}</p>}
          </button>
        </div>
      )}

      {/* Add field */}
      <div className="add card">
        <button className="inner" onClick={onAddFieldClick}>
          <svg>
            <use xlinkHref="#icon-plus" />
          </svg>{' '}
          Add field
        </button>
      </div>
    </div>
  )
}

// Computers

function computeProps({ descriptor }) {
  // Extra columns count
  const fieldsCount = descriptor.fields.length
  const columnsCount = descriptor._columns.length
  const extraColumnsCount = Math.max(columnsCount - fieldsCount, 0)

  return { extraColumnsCount }
}

// Handlers

const mapDispatchToProps = (dispatch, { descriptor, resourceIndex }) => ({
  onAddFieldClick: () => {
    const column = descriptor._columns[descriptor.fields.length]
    const payload = column ? column.descriptor : {}
    dispatch({
      type: 'ADD_FIELD',
      payload,
      resourceIndex,
    })
  },

  onAddAllFieldsClick: () => {
    const fields = descriptor.fields
    const columns = descriptor._columns
    for (const [index, column] of columns.entries()) {
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

// Componenets

let EditorSchema = connect(null, mapDispatchToProps)(EditorSchemaPure)
EditorSchema = withProps(computeProps)(EditorSchema)

// System

module.exports = {
  // Public
  EditorSchema,

  // Private
  EditorSchemaPure,
}
