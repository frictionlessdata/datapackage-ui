const React = require('react')
const classNames = require('classnames')
const {connect} = require('react-redux')
const {EditorSidebar} = require('./EditorSidebar')
const {EditorPreview} = require('./EditorPreview')
const {EditorResource} = require('./EditorResource')
const {createReducer} = require('../reducers/editorPackage')


// Pure components

function EditorPackagePure({

  // Subscribed
  isPreviewActive,
  publicDescriptor,
  descriptor,
  feedback,

  // Handlers
  onAddResourceClick,

}) {
  return (
    <div className={classNames('app', 'datapackage-ui', {'code-view': isPreviewActive})}>

      {/* Sidebar */}
      <EditorSidebar
        descriptor={descriptor}
        publicDescriptor={publicDescriptor}
      />

      <section className="resources">

        {/* Feedback */}
        {feedback &&
          <div className={`alert alert-${feedback.type}`} role="alert">
            <p>{feedback.text}</p>
            {feedback.messages &&
              <ul>
                {feedback.messages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            }
          </div>
        }

        {/* Resources */}
        <div>
          <header className="section-heading">
            <h2>Resources</h2>
          </header>

          {/* List resources */}
          <div className="panel-group" id="resources-data" role="tablist" aria-multiselectable="true">
            {descriptor.resources.map((resourceDescriptor, resourceIndex) => (
              <EditorResource
                descriptor={resourceDescriptor}
                isSettingsActive={false}
                resourceIndex={resourceIndex}
                key={resourceDescriptor._key}
              />
            ))}
          </div>

          {/* Add resource */}
          <a className="add resource" onClick={onAddResourceClick}>
            <svg><use xlinkHref="#icon-plus" /></svg>
            Add resource
          </a>
        </div>

      </section>

      {/* Preview */}
      <EditorPreview
        publicDescriptor={publicDescriptor}
      />

      {/* Svg */}
      <svg className="svgstore">
        <symbol viewBox="0 0 71.66 61.27" id="icon-braces"><title>braces</title><path d="M30.71,25.34H32a0.6,0.6,0,0,0,.6-0.6V20.6A0.6,0.6,0,0,0,32,20H30.48c-7.37,0-11.59,3.81-11.59,10.46a45.47,45.47,0,0,0,.61,6.33A44.67,44.67,0,0,1,20.1,43c0,2.46-.65,5-5.5,5a0.6,0.6,0,0,0-.6.6v3.84a0.6,0.6,0,0,0,.6.6c4.93,0,5.5,2.88,5.5,5a40.62,40.62,0,0,1-.36,4.63c-0.05.46-.11,0.93-0.15,1.36a34.15,34.15,0,0,0-.69,6.28c0,7,4.09,10.91,11.51,10.91H32a0.6,0.6,0,0,0,.6-0.6V76.53a0.6,0.6,0,0,0-.6-0.6H30.72C27,75.86,25.29,74,25.29,70a32.68,32.68,0,0,1,.38-4.26l0.14-1.08a36.58,36.58,0,0,0,.61-5.87c0.06-4.08-1.5-7-4.43-8.3,3-1.36,4.49-4.11,4.42-8.2a34.07,34.07,0,0,0-.58-5.61l-0.17-1.3a31.67,31.67,0,0,1-.38-4.15C25.29,27.16,26.91,25.41,30.71,25.34Z" transform="translate(-14 -20)" />
          <path d="M85.06,48c-4.84,0-5.5-2.51-5.5-5a44.88,44.88,0,0,1,.6-6.25,45.61,45.61,0,0,0,.61-6.32C80.76,23.81,76.54,20,69.17,20h-1.5a0.6,0.6,0,0,0-.6.6v4.14a0.6,0.6,0,0,0,.6.6h1.27c3.81,0.07,5.43,1.82,5.43,5.87A31.66,31.66,0,0,1,74,35.37l-0.17,1.28a34.23,34.23,0,0,0-.58,5.62c-0.07,4.1,1.42,6.85,4.43,8.21-2.93,1.33-4.49,4.22-4.43,8.29a36.37,36.37,0,0,0,.61,5.87L74,65.72A32.68,32.68,0,0,1,74.37,70c0,4-1.68,5.88-5.42,5.95H67.67a0.6,0.6,0,0,0-.6.6v4.14a0.6,0.6,0,0,0,.6.6h1.58c7.43,0,11.51-3.88,11.51-10.91a43.94,43.94,0,0,0-.61-6.26l0-.24a41.6,41.6,0,0,1-.56-5.78c0-2.17.57-5,5.5-5a0.6,0.6,0,0,0,.6-0.6V48.6A0.6,0.6,0,0,0,85.06,48Z" transform="translate(-14 -20)" />
          <path d="M38.36,54.1a3.23,3.23,0,0,1-3.19-3.47,3.28,3.28,0,0,1,3.3-3.47,3.21,3.21,0,0,1,3.24,3.47,3.25,3.25,0,0,1-3.3,3.47H38.36Z" transform="translate(-14 -20)" />
          <path d="M49.75,54.1a3.23,3.23,0,0,1-3.19-3.47,3.28,3.28,0,0,1,3.3-3.47,3.21,3.21,0,0,1,3.25,3.47,3.25,3.25,0,0,1-3.3,3.47H49.75Z" transform="translate(-14 -20)" />
          <path d="M61.13,54.1a3.23,3.23,0,0,1-3.19-3.47,3.28,3.28,0,0,1,3.3-3.47,3.21,3.21,0,0,1,3.25,3.47,3.25,3.25,0,0,1-3.3,3.47H61.13Z" transform="translate(-14 -20)" />
        </symbol>
        <symbol viewBox="0 0 384 512" id="icon-drag"><title>drag</title><path d="M352,64H288V448h64ZM160,64V448h64V64ZM32,64V448H96V64Z" /></symbol>
        <symbol viewBox="0 0 384 237" id="icon-expand"><title>expand</title><path d="M339,0l45,45L192,237,0,45,45,0,192,147Z" /></symbol>
        <symbol viewBox="0 0 45 68" id="icon-f"><title>f</title> <g transform="matrix(1.77473,0,0,1.77473,0,0)"> <path d="M25.2,8.2L25.2,0L0,0L0,25.4L1.9,23.6L2.5,22.9L2.5,30.6L10.1,38.2L10.6,38.2L10.6,22.9L25.2,22.9L25.2,14.8L10.7,14.8L8.8,16.6L8.1,17.3L8.1,8.2L25.2,8.2Z" style={{fillRule: 'nonzero'}} /> </g> </symbol>
        <symbol viewBox="0 0 320 512" id="icon-plus"><title>plus</title> <path d="M192 224v-128h-64v128h-128v64h128v128h64v-128h128v-64h-128z" /> </symbol>
        <symbol viewBox="0 0 448 512" id="icon-settings"><title>settings</title><path d="M224,175a81,81,0,1,0,80.72,81A81,81,0,0,0,224,175ZM386.31,302.53l-14.59,35.16,29.47,57.88-36.09,36.09-59.22-28-35.16,14.44-17.84,54.63L250.6,480h-51L177.5,418.34l-35.16-14.5-58,29.34L48.32,397.12l27.94-59.25L61.77,302.75,0,282.59v-51l61.7-22.11,14.48-35.09-26-51.23-3.42-6.72,36-36,59.3,27.92,35.11-14.52,17.83-54.59,2.3-7.23h51l22.09,61.73,35.06,14.52,58-29.41,36.06,36-27.94,59.2,14.44,35.17L448,229.38v51l-61.69,22.19Z" /></symbol>
        <symbol viewBox="0 0 384 512" id="icon-trashcan"><title>trashcan</title><path d="M336,64H208V48a16,16,0,1,0-32,0V64H48A32,32,0,0,0,16,96v32a32,32,0,0,0,32,32V448a32,32,0,0,0,32,32H304a32,32,0,0,0,32-32V160a32,32,0,0,0,32-32V96A32,32,0,0,0,336,64ZM304,432a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16V160h32V400a16,16,0,0,0,32,0l.19-240H176V400a16,16,0,0,0,32,0l.19-240h32L240,400a16,16,0,0,0,32,0V160h32Zm32-312a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V104a8,8,0,0,1,8-8H328a8,8,0,0,1,8,8Z" /></symbol>
      </svg>

    </div>
  )
}


// Subscribers

const mapStateToProps = (state) => ({

  isPreviewActive:
    state.isPreviewActive,

  publicDescriptor:
    state.publicDescriptor,

  descriptor:
    state.descriptor,

  feedback:
    state.feedback,

})


// Handlers

const mapDispatchToProps = (dispatch) => ({

  onAddResourceClick:
    () => {
      dispatch({
        type: 'ADD_RESOURCE',
      })
    },

})


// Components

const EditorPackage = connect(mapStateToProps, mapDispatchToProps)(EditorPackagePure)
EditorPackage.editorType = 'package'
EditorPackage.createReducer = createReducer


// System

module.exports = {

  // Public
  EditorPackage,

  // Private
  EditorPackagePure,

}
