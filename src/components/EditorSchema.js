const React = require('react')
const {EditorFields} = require('./EditorFields')


// Module API

function EditorSchema({descriptor, columns}) {
  return (
    <EditorFields descriptors={descriptor.fields} columns={columns} />
  )
}


// System

module.exports = {
  EditorSchema,
}
