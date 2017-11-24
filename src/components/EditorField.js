const React = require('react')


// Module API

function EditorField({descriptor, column}) {
  return (
    <div>

      {/* Heading */}
      <header>
        <span className="drag"><svg><use xlinkHref="#icon-drag" /></svg></span>
        <h3 className="heading">{descriptor.name}</h3>
        <button type="button" className="action" aria-label="Remove">
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
        <label htmlFor="title_3">Title</label>
        <input type="text" value={descriptor.title} id="title_3" />
        <label htmlFor="description_3">Description</label>
        <textarea id="description_3" value={descriptor.description} />
        <label htmlFor="type_3">Data Type</label>
        <input type="text" id="type_3" value={descriptor.type} />
        <label htmlFor="format_3">Data Format</label>
        <input type="text" id="type_3" value={descriptor.format} />
      </div>

    </div>
  )
}


// System

module.exports = {
  EditorField,
}
