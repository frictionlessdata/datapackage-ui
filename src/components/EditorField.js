const React = require('react')


// Module API

function EditorField({

  // Props
  index,
  descriptor,
  updateSchema,

}) {
  const column = ['value1', 'value2', 'value3']
  return (
    <div>

      {/* Heading */}
      <header>

        {/* Name */}
        <span className="drag"><svg><use xlinkHref="#icon-drag" /></svg></span>
        <input
          type="text"
          value={descriptor.name}
          id="title_3"
          style={{
            color: 'white',
            backgroundColor: '#00994c',
            border: 'solid 1px #00773b',
            paddingLeft: '0.5em',
            paddingRight: '0.5em',
          }}
          onChange={(event) => {
            updateSchema({
              type: 'UPDATE_FIELD',
              fieldIndex: index,
              fieldDescriptor: {name: event.target.value}
            })
          }}
        />

        {/* Remove */}
        <button
          type="button"
          className="action"
          aria-label="Remove"
          onClick={(event) => {
            updateSchema({
              type: 'REMOVE_FIELD',
              fieldIndex: index,
            })
          }}
        >
          <svg><use xlinkHref="#icon-trashcan" /></svg>
        </button>

      </header>

      {/* Preview */}
      <div className="preview">
        <ol>
          {column.map((cell, index) => (
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
          value={descriptor.title}
          id="title_3"
          onChange={(event) => {
            updateSchema({
              type: 'UPDATE_FIELD',
              fieldIndex: index,
              fieldDescriptor: {title: event.target.value}
            })
          }}
        />

        {/* Description */}
        <label htmlFor="description_3">Description</label>
        <textarea
          id="description_3"
          value={descriptor.description}
          onChange={(event) => {
            updateSchema({
              type: 'UPDATE_FIELD',
              fieldIndex: index,
              fieldDescriptor: {description: event.target.value}
            })
          }}
        />

        {/* Type */}
        <label htmlFor="type_3">Data Type</label>
        <input
          type="text"
          id="type_3"
          value={descriptor.type}
          onChange={(event) => {
            updateSchema({
              type: 'UPDATE_FIELD',
              fieldIndex: index,
              fieldDescriptor: {type: event.target.value}
            })
          }}
        />

        {/* Format */}
        <label htmlFor="format_3">Data Format</label>
        <input
          type="text"
          id="type_3"
          value={descriptor.format}
          onChange={(event) => {
            updateSchema({
              type: 'UPDATE_FIELD',
              fieldIndex: index,
              fieldDescriptor: {format: event.target.value}
            })
          }}
        />

      </div>

    </div>
  )
}


// System

module.exports = {
  EditorField,
}
