const React = require('react')
const { Readable } = require('stream')
const { Table } = require('tableschema')
const { connect } = require('react-redux')
const classNames = require('classnames')
const partial = require('lodash/partial')
const { withState } = require('recompose')
const { EditorSchema } = require('./EditorSchema')
const config = require('../config')

// Pure components

function EditorResourcePure({
  // Props
  descriptor,
  resourceIndex,

  // State
  isSettingsActive,
  setIsSettingsActive,

  // Handlers
  onRemoveClick,
  onUploadClick,
  onUploadChange,
  onUpdateChange,
}) {
  const references = {}
  const panelHeadingId = `resource-${resourceIndex}-heading`

  return (
    <div className="panel">
      {/* Metadata */}
      <div className="panel-heading" role="tab" id={panelHeadingId}>
        <div className="title" style={{ width: '90%' }}>
          <div className="row">
            {/* Name */}
            <div className="col-sm-3">
              <div className="input-group">
                <span className="input-group-addon" id="basic-addon1">
                  Name
                </span>
                <input
                  className="form-control"
                  autoComplete="off"
                  type="text"
                  defaultValue={descriptor.name}
                  onBlur={partial(onUpdateChange, 'name')}
                />
              </div>
            </div>

            <div className="col-sm-9">
              <div className="input-group">
                {/* Path */}
                <span className="input-group-addon" id="basic-addon1">
                  Path
                </span>
                <input
                  className="form-control"
                  autoComplete="off"
                  type="text"
                  defaultValue={descriptor.path}
                  placeholder="Type resource path"
                  onBlur={partial(onUpdateChange, 'path')}
                  ref={(ref) => {
                    references.path = ref
                  }}
                />

                {/* Upload */}
                <span className="input-group-btn">
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={partial(onUploadChange, references)}
                    ref={(ref) => {
                      references.upload = ref
                    }}
                  />
                  <button className="btn btn-default" onClick={partial(onUploadClick, references)}>
                    Load
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="actions">
          {/* Remove */}
          <a role="button" onClick={onRemoveClick}>
            <svg>
              <use xlinkHref="#icon-trashcan" />
            </svg>
            <span className="text">Remove</span>
          </a>

          {/* Settings */}
          <a
            className={classNames('settings-button', 'action', { active: isSettingsActive })}
            onClick={() => {
              setIsSettingsActive(!isSettingsActive)
            }}
          >
            <svg>
              <use xlinkHref="#icon-settings" />
            </svg>
            <span className="text">Settings</span>
          </a>

          {/* Expand/collapse */}
          <a
            role="button"
            data-toggle="collapse"
            href={`#collapse${resourceIndex}`}
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            <svg>
              <use xlinkHref="#icon-expand" />
            </svg>
            <span className="text">Expand / collapse</span>
          </a>
        </div>

        <div className={classNames('settings', { active: isSettingsActive })}>
          <span>
            {/* Title */}
            <label htmlFor={makeId(descriptor, 'title')} className="control-label">
              Title
            </label>
            <input
              id={makeId(descriptor, 'title')}
              className="form-control"
              pattern="^([a-z0-9._-])+$"
              name="root[resources][0][name]"
              autoComplete="off"
              type="text"
              defaultValue={descriptor.title}
              onBlur={partial(onUpdateChange, 'title')}
            />

            {/* Profile */}
            <label htmlFor={makeId(descriptor, 'profile')} className="control-label">
              Profile
            </label>
            <select
              id={makeId(descriptor, 'profile')}
              data-id="list-container"
              className="form-control list-container"
              autoComplete="off"
              defaultValue={descriptor.profile}
              onChange={partial(onUpdateChange, 'profile')}
            >
              <option value="data-resource">Data Resource</option>
              <option value="tabular-data-resource">Tabular Data Resource</option>
            </select>

            {/* Format */}
            <label htmlFor={makeId(descriptor, 'format')} className="control-label">
              Format
            </label>
            <input
              id={makeId(descriptor, 'format')}
              className="form-control"
              name="root[resources][0][format]"
              autoComplete="off"
              type="text"
              defaultValue={descriptor.format}
              onBlur={partial(onUpdateChange, 'format')}
            />

            {/* Encoding */}
            <label htmlFor={makeId(descriptor, 'encoding')} className="control-label">
              Encoding
            </label>
            <input
              id={makeId(descriptor, 'encoding')}
              className="form-control"
              name="root[resources][0][encoding]"
              autoComplete="off"
              type="text"
              defaultValue={descriptor.encoding}
              onBlur={partial(onUpdateChange, 'encoding')}
            />
          </span>
          <span>
            {/* Description */}
            <label htmlFor={makeId(descriptor, 'description')} className="control-label">
              Description
            </label>
            <textarea
              id={makeId(descriptor, 'description')}
              className="form-control"
              data-schemaformat="textarea"
              name="root[resources][0][description]"
              defaultValue={descriptor.description}
              onBlur={partial(onUpdateChange, 'description')}
            />
          </span>
        </div>
      </div>

      {/* Schema */}
      <div
        id={`collapse${resourceIndex}`}
        className={classNames('panel-collapse', 'collapse', 'in')}
        role="tabpanel"
        aria-labelledby={panelHeadingId}
      >
        <div className="panel-body">
          <EditorSchema descriptor={descriptor.schema} resourceIndex={resourceIndex} />
        </div>
      </div>
    </div>
  )
}

// State

const stateName = 'isSettingsActive'
const stateUpdaterName = 'setIsSettingsActive'
const initialState = false

// Handlers

const mapDispatchToProps = (dispatch, { resourceIndex, descriptor }) => ({
  onRemoveClick: () => {
    dispatch({
      type: 'REMOVE_RESOURCE',
      resourceIndex,
    })
  },

  onUpdateChange: (name, ev) => {
    dispatch({
      type: 'UPDATE_RESOURCE',
      payload: { [name]: ev.target.value },
      resourceIndex,
    })
  },

  onUploadClick: (references) => {
    if (descriptor.path.startsWith('http')) {
      dispatch(async () => {
        const table = await Table.load(descriptor.path)
        const rows = await table.read({ limit: config.EDITOR_UPLOAD_ROWS_LIMIT })
        const headers = table.headers
        dispatch({
          type: 'UPLOAD_DATA',
          rows,
          headers,
          resourceIndex,
        })
      })
    } else {
      references.upload.click()
    }
  },

  onUploadChange: (references, ev) => {
    if (!descriptor.path) {
      const path = ev.target.files[0].name
      references.path.value = path
      dispatch({
        type: 'UPDATE_RESOURCE',
        payload: { path },
        resourceIndex,
      })
    }
    dispatch(async () => {
      const text = await readFile(ev.target.files[0])
      const stream = new Readable()
      stream.push(text)
      stream.push(null)
      const table = await Table.load(stream)
      const rows = await table.read({ limit: config.EDITOR_UPLOAD_ROWS_LIMIT })
      const headers = table.headers
      dispatch({
        type: 'UPLOAD_DATA',
        rows,
        headers,
        resourceIndex,
      })
    })
  },
})

// Helpers

function makeId(descriptor, key) {
  return `resource-${descriptor._key}-${key}`
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new window.FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      resolve(reader.result)
    }
  })
}

// Wrappers

let EditorResource = withState(stateName, stateUpdaterName, initialState)(EditorResourcePure)
EditorResource = connect(null, mapDispatchToProps)(EditorResource)

// System

module.exports = {
  // Public
  EditorResource,

  // Private
  EditorResourcePure,
}
