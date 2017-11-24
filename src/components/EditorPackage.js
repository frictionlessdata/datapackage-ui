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
  updatePackage,
  updateResource,
  removeResource,
  addResource,
  togglePreview,

}) {
  return (
    <div className={classNames('app', {'code-view': isPreviewActive})}>

      {/* Menu */}
      <EditorMenu
        descriptor={descriptor}
        updatePackage={updatePackage}
      />

      {/* Resources */}
      <EditorResources
        descriptors={descriptor.resources}
        updateResource={updateResource}
        removeResource={removeResource}
        addResource={addResource}
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


const updatePackage = ({descriptor}) => (payload) => {
  descriptor = {...descriptor, ...payload}
  return {descriptor}
}


const updateResource = ({descriptor}) => (index, payload) => {
  descriptor = {...descriptor}
  descriptor.resources[index] = {...descriptor.resources[index], ...payload}
  return {descriptor}
}


const removeResource = ({descriptor}) => (index) => {
  descriptor = {...descriptor}
  descriptor.resources.splice(index, 1)
  return {descriptor}
}


const addResource = ({descriptor}) => (payload) => {
  descriptor = {...descriptor}
  descriptor.resources.push(payload)
  return {descriptor}
}


const togglePreview = ({isPreviewActive}) => () => {
  isPreviewActive = !isPreviewActive
  return {isPreviewActive}
}


// System

module.exports = {
  EditorPackage: withStateHandlers(initialState, {
    updatePackage,
    updateResource,
    removeResource,
    addResource,
    togglePreview,
  })(EditorPackage),
}
