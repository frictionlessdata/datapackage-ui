const React = require('react')
const classNames = require('classnames')
const cloneDeep = require('lodash/cloneDeep')
const {withStateHandlers} = require('recompose')
const {EditorMenu} = require('./EditorMenu')
const {EditorPreview} = require('./EditorPreview')
const {EditorResource} = require('./EditorResource')


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
      <section className="resources">

        {/* Header */}
        <header className="section-heading">
          <h2>Resources</h2>
        </header>

        {/* List resources */}
        <div className="panel-group" id="resources-data" role="tablist" aria-multiselectable="true">
          {descriptor.resources.map((descriptor, index) => (
            <EditorResource
              index={index}
              descriptor={descriptor}
              updateResource={updateResource}
              removeResource={removeResource}
              columns={columns}
              key={index}
            />
          ))}
        </div>

        {/* Add resource */}
        <a
          className="add resource"
          onClick={(event) => {
            addResource({name: 'resource4', schema: {fields: []}})
          }}
        >
          <svg><use xlinkHref="#icon-plus" /></svg> Add resource
        </a>

      </section>

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
