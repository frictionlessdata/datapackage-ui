const React = require('react')
const partial = require('lodash/partial')
const {connect} = require('react-redux')


// Pure components

function EditorMetadataPure({

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
          <a
            className="collapsed"
            role="button"
            data-toggle="collapse"
            data-parent="#package-data"
            href="#optional-metadata"
            aria-expanded="false"
            aria-controls="optional-metadata"
          >
            <span className="text">Metadata</span>
            <span className="icon"><svg><use xlinkHref="#icon-expand" /></svg></span>
          </a>
        </h4>
      </div>

      <div id="optional-metadata" className="panel-collapse collapse" role="tabpanel" aria-labelledby="optional-metadata-heading">
        <div className="panel-body">

          {/* Name */}
          <label htmlFor={makeId('name')} className="control-label">
            Name
          </label>
          <input
            id={makeId('name')}
            className="form-control"
            pattern="^([a-z0-9._-])+$"
            name="root[name]"
            type="text"
            defaultValue={descriptor.name}
            onBlur={partial(onUpdateChange, 'name')}
          />

          {/* Title */}
          <label htmlFor={makeId('title')} className="control-label">
            Title
          </label>
          <input
            id={makeId('title')}
            className="form-control"
            name="root[title]"
            type="text"
            defaultValue={descriptor.title}
            onBlur={partial(onUpdateChange, 'title')}
          />

          {/* Profile */}
          <label htmlFor={makeId('profile')} className="control-label">
            Profile
          </label>
          <select
            id={makeId('profile')}
            data-id="list-container"
            className="form-control list-container"
            autoComplete="off"
            defaultValue={descriptor.profile}
            onChange={partial(onUpdateChange, 'profile')}
          >
            <option value="data-package">Data Package</option>
            <option value="tabular-data-package">Tabular Data Package</option>
            <option value="fiscal-data-package">Fiscal Data Package</option>
          </select>

          {/* Description */}
          <label htmlFor={makeId('description')} className="control-label">
            Description
          </label>
          <textarea
            id={makeId('description')}
            className="form-control"
            data-schemaformat="textarea"
            name="root[description]"
            defaultValue={descriptor.description}
            onBlur={partial(onUpdateChange, 'description')}
          />

          {/* Home Page */}
          <label htmlFor={makeId('homepage')} className="control-label">
            Home Page
          </label>
          <input
            id={makeId('homepage')}
            className="form-control"
            name="root[homepage]"
            type="text"
            defaultValue={descriptor.homepage}
            onBlur={partial(onUpdateChange, 'homepage')}
          />

          {/* Version */}
          <label htmlFor={makeId('version')} className="control-label">
            Version
          </label>
          <input
            id={makeId('version')}
            className="form-control"
            name="root[version]"
            type="text"
            defaultValue={descriptor.version}
            onBlur={partial(onUpdateChange, 'version')}
          />

          {/* License */}
          <label htmlFor={makeId('license')} className="control-label">
            License
          </label>
          <input
            id={makeId('license')}
            className="form-control"
            name="root[license]"
            type="text"
            defaultValue={descriptor.license}
            onBlur={partial(onUpdateChange, 'license')}
          />

          {/* Author */}
          <label htmlFor={makeId('author')} className="control-label">
            Author
          </label>
          <input
            id={makeId('author')}
            className="form-control"
            name="root[author]"
            type="text"
            defaultValue={descriptor.author}
            onBlur={partial(onUpdateChange, 'author')}
          />

        </div>
      </div>
    </div>
  )
}


// Handlers

const mapDispatchToProps = (dispatch) => ({

  onUpdateChange:
    (name, ev) => {
      dispatch({
        type: 'UPDATE_PACKAGE',
        payload: {[name]: ev.target.value},
      })
    },

})


// Helpers

function makeId(key) {
  return `package-${key}`
}


// Components

const EditorMetadata = connect(null, mapDispatchToProps)(EditorMetadataPure)


// System

module.exports = {

  // Public
  EditorMetadata,

  // Private
  EditorMetadataPure,

}
