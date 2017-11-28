const React = require('react')
const {connect} = require('react-redux')
const partial = require('lodash/partial')


// Components

function EditorField({

  // Props
  column,
  descriptor,
  fieldIndex,
  resourceIndex,

  // Handlers
  onRemoveClick,
  onUpdateChange,

}) {
  return (
    <div>

      {/* Heading */}
      <header>

        {/* Name */}
        <span className="drag"><svg><use xlinkHref="#icon-drag" /></svg></span>
        <input
          type="text"
          value={descriptor.name || ''}
          id="title_3"
          style={{
            color: 'white',
            backgroundColor: '#00994c',
            border: 'solid 1px #00773b',
            paddingLeft: '0.5em',
            paddingRight: '0.5em',
          }}
          onChange={partial(onUpdateChange, 'name')}
        />

        {/* Remove */}
        <button
          type="button"
          className="action"
          aria-label="Remove"
          onClick={onRemoveClick}
        >
          <svg><use xlinkHref="#icon-trashcan" /></svg>
        </button>

      </header>

      {/* Preview */}
      <div className="preview">
        <ol>
          {(column.values || []).map((cell, index) => (
            <li key={index}><span>{cell}</span></li>
          ))}
        </ol>
      </div>

      {/* Metadata */}
      <div className="field-info">

        {/* Title */}
        <label htmlFor="title_3">Title</label>
        <input
          type="text"
          value={descriptor.title || ''}
          id="title_3"
          onChange={partial(onUpdateChange, 'title')}
        />

        {/* Description */}
        <label htmlFor="description_3">Description</label>
        <textarea
          id="description_3"
          value={descriptor.description || ''}
          onChange={partial(onUpdateChange, 'description')}
        />

        {/* Type */}
        <label htmlFor="type_3">Data Type</label>
        <input
          type="text"
          id="type_3"
          value={descriptor.type || ''}
          onChange={partial(onUpdateChange, 'type')}
        />

        {/* Format */}
        <label htmlFor="format_3">Data Format</label>
        <input
          type="text"
          id="type_3"
          value={descriptor.format || ''}
          onChange={partial(onUpdateChange, 'format')}
        />

      </div>

    </div>
  )
}


// Handlers

const mapDispatchToProps = (dispatch, {resourceIndex, fieldIndex}) => ({

  onRemoveClick:
    (ev) => {
      dispatch({
        type: 'REMOVE_FIELD',
        resourceIndex,
        fieldIndex,
      })
    },

  onUpdateChange:
    (name, ev) => {
      dispatch({
        type: 'UPDATE_FIELD',
        payload: {[name]: ev.target.value},
        resourceIndex,
        fieldIndex,
      })
    },

})


// Wrappers

EditorField = connect(null, mapDispatchToProps)(EditorField)


// System

module.exports = {
  EditorField,
}
