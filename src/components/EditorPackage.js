const React = require('react')
const classNames = require('classnames')
const {withStateHandlers} = require('recompose')
const {EditorMenu} = require('./EditorMenu')
const {EditorPreview} = require('./EditorPreview')
const {EditorResources} = require('./EditorResources')


// Module API

function EditorPackage({

  // Props
  descriptor,
  columns,

  // State
  isPreviewActive,
  togglePreview,

}) {
  return (
    <div className={classNames('app', {'code-view': isPreviewActive})}>
      <EditorMenu descriptor={descriptor} />
      <EditorResources descriptors={descriptor.resources} columns={columns} />
      <EditorPreview descriptor={descriptor} togglePreview={togglePreview} />
    </div>
  )
}


// Internal

const initialState = {
  isPreviewActive: false,
}

const togglePreview = ({isPreviewActive}) => () => {
  return {isPreviewActive: !isPreviewActive}
}


// System

module.exports = {
  EditorPackage: withStateHandlers(initialState, {togglePreview})(EditorPackage),
}
