const React = require('react')
const { connect } = require('react-redux')

// Pure components

function EditorPreviewPure({
  // Props
  publicDescriptor,

  // Handlers
  onToggleClick,
}) {
  return (
    <section className="preview">
      {/* Heading */}
      <h2 className="section-heading" onClick={onToggleClick}>
        <svg className="icon">
          <use xlinkHref="#icon-braces" />
        </svg>
        <span className="text">Preview</span>
      </h2>

      {/* Code */}
      <pre>
        <code className="language-json">{JSON.stringify(publicDescriptor, null, 2)}</code>
      </pre>
    </section>
  )
}

// Handlers

const mapDispatchToProps = (dispatch) => ({
  onToggleClick: () => {
    dispatch({
      type: 'TOGGLE_PREVIEW',
    })
  },
})

// Components

const EditorPreview = connect(null, mapDispatchToProps)(EditorPreviewPure)

// System

module.exports = {
  // Public
  EditorPreview,

  // Private
  EditorPreviewPure,
}
