const React = require('react')
const partial = require('lodash/partial')
const {connect} = require('react-redux')


// Components

function EditorMetadata({

  // Props
  descriptor,

  // Handlers
  onUpdateChange,

}) {
  return (
    <div className="panel">

      {/* Heading */}
      <div className="panel-heading" role="tab" id="optional-metadata-heading">
        <h4 className="panel-title">
          <a className="collapsed"
            role="button"
            data-toggle="collapse"
            data-parent="#package-data"
            href="#optional-metadata"
            aria-expanded="false"
            aria-controls="optional-metadata"
          >
            <span className="text">Metadata </span>
            <span className="icon"><svg><use xlinkHref="#icon-expand" /></svg></span>
          </a>
        </h4>
      </div>

      <div id="optional-metadata" className="panel-collapse collapse" role="tabpanel" aria-labelledby="optional-metadata-heading">
        <div className="panel-body">

          {/* Name */}
          <label className="control-label">Name</label>
          <input
            className="form-control"
            pattern="^([a-z0-9._-])+$"
            name="root[name]"
            type="text"
            value={descriptor.name || ''}
            onChange={partial(onUpdateChange, 'name')}
          />

          {/* Title */}
          <label className="control-label">Title</label>
          <input
            className="form-control"
            name="root[title]"
            type="text"
            value={descriptor.title || ''}
            onChange={partial(onUpdateChange, 'title')}
          />

          {/* Profile */}
          <label className="control-label">Profile</label>
          <select
            data-id="list-container"
            className="form-control list-container"
            autoComplete="off"
            value={descriptor.profile || ''}
            onChange={partial(onUpdateChange, 'profile')}
          >
            <option value="data-package">Data Package</option>
            <option value="tabular-data-package">Tabular Data Package</option>
            <option value="fiscal-data-package">Fiscal Data Package</option>
          </select>

          {/* Description */}
          <label className="control-label">Description</label>
          <textarea className="form-control"
            data-schemaformat="textarea"
            name="root[description]"
            value={descriptor.description || ''}
            onChange={partial(onUpdateChange, 'description')}
          />

          {/* Home Page */}
          <label className="control-label">Home Page</label>
          <input
            className="form-control"
            name="root[homepage]"
            type="text"
            value={descriptor.homepage || ''}
            onChange={partial(onUpdateChange, 'homepage')}
          />

          {/* Version */}
          <label className="control-label">Version</label>
          <input
            className="form-control"
            name="root[version]"
            type="text"
            value={descriptor.version || ''}
            onChange={partial(onUpdateChange, 'version')}
          />

          {/* License */}
          <label className="control-label">License</label>
          <input
            className="form-control"
            name="root[license]"
            type="text"
            value={descriptor.license || ''}
            onChange={partial(onUpdateChange, 'license')}
          />

          {/* Author */}
          <label className="control-label">Author</label>
          <input
            className="form-control"
            name="root[author]"
            type="text"
            value={descriptor.author || ''}
            onChange={partial(onUpdateChange, 'author')}
          />

        </div>
      </div>
    </div>
  )
}


// Handlers

const mapDispatchToProps = (dispatch, ownProps) => ({

  onUpdateChange:
    (name, ev) => {
      dispatch({
        type: 'UPDATE_PACKAGE',
        payload: {[name]: ev.target.value},
      })
    },

})


// Wrappers

EditorMetadata = connect(null, mapDispatchToProps)(EditorMetadata)


// System

module.exports = {
  EditorMetadata,
}
