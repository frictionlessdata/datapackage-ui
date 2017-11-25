const React = require('react')
const {Profile} = require('datapackage')
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
  feedback,

}) {
  return (
    <div className={classNames('app', {'code-view': isPreviewActive})}>

      {/* Menu */}
      <EditorMenu
        descriptor={descriptor}
        updatePackage={updatePackage}
      />

      <section className="resources">

        {/* Feedback */}
        {feedback &&
          <div className={`alert alert-${feedback.type}`} role="alert">
            <p>{feedback.text}</p>
            <ul>
              {(feedback.messages || []).map((message) => (
                <li>{message}</li>
              ))}
            </ul>
          </div>
        }

        {/* Resources */}
        <div>
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
        </div>

      </section>

      {/* Preview */}
      <EditorPreview
        descriptor={descriptor}
        togglePreview={togglePreview}
      />

    </div>
  )
}


// State

const DEFAULT_FEEDBACK = {
  type: 'warning',
  text: 'Data package is not validated',
}


const initialState = ({descriptor}) => ({
  descriptor: cloneDeep(descriptor),
  isPreviewActive: false,
  feedback: DEFAULT_FEEDBACK,
})


const updatePackage = ({descriptor}) => (action) => {
  descriptor = {...descriptor}

  // Update package
  switch (action.type) {

    case 'UPLOAD':
      console.log(action)
      break

    case 'VALIDATE':
      // TODO: rebase on datapackage.validate
      const profile = new Profile(descriptor.profile)
      const {valid, errors} = profile.validate(descriptor)
      if (valid) {
        return {feedback: {
          type: 'success',
          text: 'Data package is valid!',
        }}
      } else {
        return {feedback: {
          type: 'danger',
          text: 'Data package is invalid!',
          messages: errors.map((error) => error.message),
        }}
      }

    case 'DOWNLOAD':
      console.log(action)
      return

    case 'UPDATE_PACKAGE':
      descriptor = {...descriptor, ...action.descriptor}
      return {descriptor, feedback: DEFAULT_FEEDBACK}

    case 'UPDATE_RESOURCE':
      descriptor.resources[action.resourceIndex] = {
        ...descriptor.resources[action.resourceIndex],
        ...action.resourceDescriptor,
      }
      return {descriptor, feedback: DEFAULT_FEEDBACK}

    case 'REMOVE_RESOURCE':
      descriptor.resources.splice(action.resourceIndex, 1)
      return {descriptor, feedback: DEFAULT_FEEDBACK}

    case 'ADD_RESOURCE':
      descriptor.resources.push(action.resourceDescriptor)
      return {descriptor, feedback: DEFAULT_FEEDBACK}

  }
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
