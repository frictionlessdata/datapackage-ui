const React = require('react')
const {EditorMenu} = require('./EditorMenu')
const {EditorPreview} = require('./EditorPreview')
const {EditorResources} = require('./EditorResources')


// Module API

function EditorPackage({descriptor, columns}) {
  return (
    <div className="app">
      <EditorMenu />
      <EditorResources descriptors={descriptor.resources} columns={columns} />
      <EditorPreview />
    </div>
  )
}


// System

module.exports = {
  EditorPackage,
}
