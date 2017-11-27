const React = require('react')


// Module API

function EditorMetadata({

  // Props
  descriptor,
  updatePackage,

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
            onChange={(event) => {
              updatePackage({
                type: 'UPDATE_PACKAGE',
                descriptor: {name: event.target.value}
              })
            }}
          />

          {/* Title */}
          <label className="control-label">Title</label>
          <input
            className="form-control"
            name="root[title]"
            type="text"
            value={descriptor.title || ''}
            onChange={(event) => {
              updatePackage({
                type: 'UPDATE_PACKAGE',
                descriptor: {title: event.target.value}
              })
            }}
          />

          {/* Profile */}
          <label className="control-label">Profile</label>
          <select
            data-id="list-container"
            className="form-control list-container"
            autoComplete="off"
            value={descriptor.profile || ''}
            onChange={(event) => {
              updatePackage({
                type: 'UPDATE_PACKAGE',
                descriptor: {profile: event.target.value}
              })
            }}
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
            onChange={(event) => {
              updatePackage({
                type: 'UPDATE_PACKAGE',
                descriptor: {description: event.target.value}
              })
            }}
          />

          {/* Home Page */}
          <label className="control-label">Home Page</label>
          <input
            className="form-control"
            name="root[homepage]"
            type="text"
            value={descriptor.homepage || ''}
            onChange={(event) => {
              updatePackage({
                type: 'UPDATE_PACKAGE',
                descriptor: {homepage: event.target.value}
              })
            }}
          />

          {/* Version */}
          <label className="control-label">Version</label>
          <input
            className="form-control"
            name="root[version]"
            type="text"
            value={descriptor.version || ''}
            onChange={(event) => {
              updatePackage({
                type: 'UPDATE_PACKAGE',
                descriptor: {version: event.target.value}
              })
            }}
          />

          {/* License */}
          <label className="control-label">License</label>
          <input
            className="form-control"
            name="root[license]"
            type="text"
            value={descriptor.license || ''}
            onChange={(event) => {
              updatePackage({
                type: 'UPDATE_PACKAGE',
                descriptor: {license: event.target.value}
              })
            }}
          />

          {/* Author */}
          <label className="control-label">Author</label>
          <input
            className="form-control"
            name="root[author]"
            type="text"
            value={descriptor.author || ''}
            onChange={(event) => {
              updatePackage({
                type: 'UPDATE_PACKAGE',
                descriptor: {author: event.target.value}
              })
            }}
          />

        </div>
      </div>
    </div>
  )
}


// System

module.exports = {
  EditorMetadata,
}
