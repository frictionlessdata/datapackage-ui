const React = require('react')
const {EditorSchema} = require('./EditorSchema')


// Module API

function EditorResource({descriptor, columns}) {
  return (
    <div className="panel">

      {/* Metadata */}
      <div className="panel-heading" role="tab" id="resource-one-heading">
        <div className="title">
          <label>Title</label>
          <input className="form-control" autoComplete="off" type="text" />
        </div>
        <div className="actions">
          <a className="settings-button">
            <svg><use xlinkHref="#icon-settings" /></svg><span className="text">Settings</span>
          </a>
          <a role="button" data-toggle="collapse" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            <svg><use xlinkHref="#icon-expand" /></svg><span className="text">Expand / collapse</span>
          </a>
        </div>
        <div className="settings">
          <span>
            <label className="control-label">Name</label>
            <input className="form-control" pattern="^([a-z0-9._-])+$" name="root[resources][0][name]" autoComplete="off" type="text" />
            <label className="control-label">Path</label>
            <input className="form-control" name="root[resources][0][path]" autoComplete="off" type="text" />
            <label className="control-label">Format</label>
            <input className="form-control" name="root[resources][0][format]" autoComplete="off" type="text" />
            <label className="control-label">Media Type</label>
            <input className="form-control" pattern="^(.+)/(.+)$" name="root[resources][0][mediatype]" autoComplete="off" type="text" />
            <label className="control-label">Encoding</label>
            <input className="form-control" name="root[resources][0][encoding]" autoComplete="off" type="text" />
          </span>
          <span>
            <label className="control-label">Description</label>
            <textarea className="form-control" data-schemaformat="textarea" name="root[resources][0][description]" defaultValue={""} />
          </span>
        </div>
      </div>

      {/* Schema */}
      <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="resource-one-heading">
        <div className="panel-body">
          <EditorSchema descriptor={descriptor.schema} columns={columns} />
        </div>
      </div>

    </div>
  )
}


// System

module.exports = {
  EditorResource,
}
