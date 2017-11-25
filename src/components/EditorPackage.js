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

  // State
  updatePackage,
  isPreviewActive,
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
              updatePackage={updatePackage}
              key={index}
            />
          ))}
        </div>

        {/* Add resource */}
        <a
          className="add resource"
          onClick={(event) => {
            updatePackage({
              type: 'ADD_RESOURCE',
              resourceDescriptor: {name: `resource${descriptor.resources.length + 1}`}
            })
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


const updatePackage = ({descriptor}) => (action) => {
  descriptor = {...descriptor}

  // Update package
  switch (action.type) {

    case 'UPDATE_PACKAGE':
      descriptor = {...descriptor, ...action.descriptor}
      break

    case 'UPDATE_RESOURCE':
      descriptor.resources[action.resourceIndex] = {
        ...descriptor.resources[action.resourceIndex],
        ...action.resourceDescriptor,
      }
      break

    case 'REMOVE_RESOURCE':
      descriptor.resources.splice(action.resourceIndex, 1)
      break

    case 'ADD_RESOURCE':
      descriptor.resources.push(action.resourceDescriptor)
      break

  }

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
    togglePreview,
  })(EditorPackage),
}
