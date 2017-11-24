const React = require('react')
const classNames = require('classnames')
const cloneDeep = require('lodash/cloneDeep')
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
  updateDescriptor,
  updateResourceDescriptor,
  togglePreview,

}) {
  return (
    <div className={classNames('app', {'code-view': isPreviewActive})}>

      {/* Menu */}
      <EditorMenu
        descriptor={descriptor}
        updateDescriptor={updateDescriptor}
      />

      {/* Resources */}
      <EditorResources
        descriptors={descriptor.resources}
        updateResourceDescriptor={updateResourceDescriptor}
        columns={columns}
      />

      {/* Preview */}
      <EditorPreview
        descriptor={descriptor}
        togglePreview={togglePreview}
      />

    </div>
  )
}


// Internal

const initialState = ({descriptor}) => ({
  descriptor: cloneDeep(descriptor),
  isPreviewActive: false,
})


const updateDescriptor = ({descriptor}) => (payload) => {
  descriptor = {...descriptor, ...payload}
  return {descriptor}
}


const updateResourceDescriptor = ({descriptor}) => (index, payload) => {
  descriptor = {...descriptor}
  descriptor.resources[index] = {...descriptor.resources[index], ...payload}
  return {descriptor}
}


const togglePreview = ({isPreviewActive}) => () => {
  isPreviewActive = !isPreviewActive
  return {isPreviewActive}
}


// System

module.exports = {
  EditorPackage: withStateHandlers(initialState, {
    updateDescriptor,
    updateResourceDescriptor,
    togglePreview,
  })(EditorPackage),
}
