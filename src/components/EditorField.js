const React = require('react')
const {connect} = require('react-redux')
const partial = require('lodash/partial')
const config = require('../config')


// Pure components

function EditorFieldPure({

  // Props
  column,
  descriptor,
  // fieldIndex,
  // resourceIndex,

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
          defaultValue={descriptor.name}
          style={{
            color: 'white',
            backgroundColor: '#3A3A3A',
            border: 'solid 1px #3A3A3A',
            paddingLeft: '0.5em',
            paddingRight: '0.5em',
          }}
          onBlur={partial(onUpdateChange, 'name')}
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
          {!!column && column.values.slice(0, 10).map((value, index) => (
            <li key={index}><span>{value}</span></li>
          ))}
        </ol>
      </div>

      {/* Metadata */}
      <div className="field-info">

        {/* Title */}
        <label htmlFor={makeId(descriptor, 'title')}>
          Title
        </label>
        <input
          type="text"
          id={makeId(descriptor, 'title')}
          defaultValue={descriptor.title}
          onBlur={partial(onUpdateChange, 'title')}
        />

        {/* Description */}
        <label htmlFor={makeId(descriptor, 'description')}>
          Description
        </label>
        <textarea
          id={makeId(descriptor, 'description')}
          defaultValue={descriptor.description}
          onBlur={partial(onUpdateChange, 'description')}
        />

        {/* Type */}
        <label htmlFor={makeId(descriptor, 'type')}>
          Data Type
        </label>
        <select
          id={makeId(descriptor, 'type')}
          data-id="list-container"
          className="form-control list-container"
          autoComplete="off"
          defaultValue={descriptor.type}
          onChange={partial(onUpdateChange, 'type')}
        >
          {getTypes().map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Format */}
        <label htmlFor={makeId(descriptor, 'format')}>
          Data Format
        </label>
        { !getFormat(descriptor.type) &&
          <input
            type="text"
            id={makeId(descriptor, 'format')}
            defaultValue={descriptor.format}
            onBlur={partial(onUpdateChange, 'format')}
          />
        }
        { !!getFormat(descriptor.type) &&
          <select
            id={makeId(descriptor, 'format')}
            data-id="list-container"
            className="form-control list-container"
            autoComplete="off"
            defaultValue={descriptor.format}
            onChange={partial(onUpdateChange, 'format')}
          >
            {getFormat(descriptor.type).map((format) => (
              <option key={format} value={format}>{format}</option>
            ))}
          </select>
        }

      </div>

    </div>
  )
}


// Handlers

const mapDispatchToProps = (dispatch, {resourceIndex, fieldIndex}) => ({

  onRemoveClick:
    () => {
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


// Helpers

function getTypes() {
  return Object.keys(config.FIELD_TYPES_AND_FORMATS)
}


function getFormat(type) {
  return config.FIELD_TYPES_AND_FORMATS[type]
}


function makeId(descriptor, key) {
  return `field-${descriptor._key}-${key}`
}


// Components

const EditorField = connect(null, mapDispatchToProps)(EditorFieldPure)


// System

module.exports = {

  // Public
  EditorField,

  // Private
  EditorFieldPure,

}
