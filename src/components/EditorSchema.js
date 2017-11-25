const React = require('react')
const zip = require('lodash/zip')
const {EditorField} = require('./EditorField')


// Module API

function EditorSchema({descriptor, columns}) {
  return (
    <div className="data-cards sortable">

      {/* Fields */}
      {zip(descriptor.fields, columns).map(([descriptor, column], index) => (
        <div className="draggable card" id="column_1" key={index}>
          <div className="inner">
            <EditorField descriptor={descriptor} column={column} />
          </div>
        </div>
      ))}

      {/* Add field */}
      <div className="add card">
        <a className="inner">
          <svg><use xlinkHref="#icon-plus" /></svg> Add item
        </a>
      </div>

    </div>
  )
}


// System

module.exports = {
  EditorSchema,
}
