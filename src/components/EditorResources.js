const React = require('react')
const {EditorResource} = require('./EditorResource')


// Module API

function EditorResources({descriptors, columns}) {
  return (
    <section className="resources">

      {/* Header */}
      <header className="section-heading">
        <h2>Resources</h2>
      </header>

      {/* Resources */}
      <div className="panel-group" id="resources-data" role="tablist" aria-multiselectable="true">
        {descriptors.map((descriptor, index) => (
          <EditorResource descriptor={descriptor} columns={columns} key={index} index={index} />
        ))}
      </div>

      {/* Add Field */}
      <a className="add resource">
        <svg><use xlinkHref="#icon-plus" /></svg> Add another data file
      </a>

    </section>
  )
}


// System

module.exports = {
  EditorResources,
}
