const React = require('react')
const {EditorResource} = require('./EditorResource')


// Module API

function EditorResources({

  // Props
  descriptors,
  updateResource,
  removeResource,
  addResource,
  columns

}) {
  return (
    <section className="resources">

      {/* Header */}
      <header className="section-heading">
        <h2>Resources</h2>
      </header>

      {/* Resources */}
      <div className="panel-group" id="resources-data" role="tablist" aria-multiselectable="true">
        {descriptors.map((descriptor, index) => (
          <EditorResource
            index={index}
            descriptor={descriptor}
            updateResource={updateResource}
            removeResource={removeResource}
            columns={columns}
            key={index}
          />
        ))}
      </div>

      {/* Add resource */}
      <a
        className="add resource"
        onClick={(event) => {
          addResource({name: 'resource4', schema: {fields: []}})
        }}
      >
        <svg><use xlinkHref="#icon-plus" /></svg> Add resource
      </a>

    </section>
  )
}


// System

module.exports = {
  EditorResources,
}
