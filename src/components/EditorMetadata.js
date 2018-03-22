const React = require('react')
const partial = require('lodash/partial')
const {connect} = require('react-redux')
const {LicenseField} = require('./LicenseField')
const {ContributorField} = require('./ContributorField')


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
          Metadata
        </h4>
      </div>

      <div id="optional-metadata" aria-labelledby="optional-metadata-heading">
        <div className="panel-body">

          {/* Name */}
          <label htmlFor={makeId('name')} className="control-label">
            Name *
          </label>
          <input
            id={makeId('name')}
            className="form-control"
            pattern="^([a-z0-9._-])+$"
            name="root[name]"
            type="text"
            defaultValue={descriptor.name}
            placeholder="my-data-package"
            onBlur={partial(onUpdateChange, 'name')}
            required
          />

          {/* Title */}
          <label htmlFor={makeId('title')} className="control-label">
            Title *
          </label>
          <input
            id={makeId('title')}
            className="form-control"
            name="root[title]"
            type="text"
            defaultValue={descriptor.title}
            placeholder="My Data Package"
            onBlur={partial(onUpdateChange, 'title')}
            required
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
            placeholder="Describe your dataset"
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
            placeholder="https://example.com"
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
            placeholder="1.0.0"
            onBlur={partial(onUpdateChange, 'version')}
          />

          {/* Author */}
          <ContributorField contributors={descriptor.contributors} />

          {/* License */}
          <LicenseField licenses={descriptor.licenses} />

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
