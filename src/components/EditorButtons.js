const React = require('react')
const { connect } = require('react-redux')

// Pure components

function EditorButtonsPure({
  encodedDescriptor,

  // Handlers
  onUploadChange,
  onValidateClick,
}) {
  return (
    <div>
      {/* Upload */}
      <label
        className="btn btn-lg btn-success"
        title="Upload a data package from your local drive"
        htmlFor="load-descriptor"
      >
        <input
          type="file"
          id="load-descriptor"
          value=""
          style={{ display: 'none' }}
          onChange={onUploadChange}
        />
        Upload
      </label>

      {/* Validate */}
      <button
        className="btn btn-lg btn-info"
        title="Validate the data package verifying its metadata"
        onClick={onValidateClick}
      >
        Validate
      </button>

      {/* Download */}
      <a
        className="btn btn-lg btn-success"
        href={`data: ${encodedDescriptor}`}
        download="datapackage.json"
        title="Download the data package to your local drive"
      >
        Download
      </a>
    </div>
  )
}

// Handlers

const mapDispatchToProps = (dispatch) => ({
  onUploadChange: (ev) => {
    const reader = new window.FileReader()
    reader.readAsText(ev.target.files[0])
    reader.onload = () => {
      dispatch({
        type: 'UPLOAD_PACKAGE',
        payload: JSON.parse(reader.result),
      })
    }
  },

  onValidateClick: () => {
    dispatch({
      type: 'VALIDATE_PACKAGE',
    })
  },
})

// Wrappers

const EditorButtons = connect(null, mapDispatchToProps)(EditorButtonsPure)

// System

module.exports = {
  // Public
  EditorButtons,

  // Private
  EditorButtonsPure,
}
