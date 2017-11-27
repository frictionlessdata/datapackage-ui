const React = require('react')
const {withState} = require('recompose')


// Module API

function EditorKeywords({

  // Props
  keywords,
  updatePackage,

  // State
  newKeyword,

  // Handlers
  updateNewKeyword,

}) {
  return (
    <div className="panel">

      {/* Heading */}
      <div className="panel-heading" role="tab" id="keywords-heading">
        <h4 className="panel-title">
          <a className="collapsed"
            role="button"
            data-toggle="collapse"
            data-parent="#package-data"
            href="#keywords"
            aria-expanded="false"
            aria-controls="keywords"
          >
            <span className="text">Keywords </span>
            <span className="icon"><svg><use xlinkHref="#icon-expand" /></svg></span>
          </a>
        </h4>
      </div>

      <div
        id="keywords"
        className="panel-collapse collapse"
        role="tabpanel"
        aria-labelledby="keywords-heading"
      >
        <div className="panel-body">

          {/* List keywords */}
          {(keywords || []).map((keyword, index) => (
            <p key={index}>

              {/* Update keyword */}
              <input
                className="form-control"
                type="text"
                value={keyword}
                onChange={(event) => {
                  keywords = [...keywords]
                  keywords[index] = event.target.value
                  updatePackage({
                    type: 'UPDATE_PACKAGE',
                    descriptor: {keywords}
                  })
                }}
              />

              {/* Remove keyword */}
              <button
                type="button"
                className="btn btn-info btn-sm json-editor-btn-add "
                title="Add item"
                onClick={(event) => {
                  keywords = [...keywords]
                  keywords.splice(index, 1)
                  updatePackage({
                    type: 'UPDATE_PACKAGE',
                    descriptor: {keywords}
                  })
                }}
              >
               Remove keyword
              </button>

            </p>
          ))}

          {/* Add keyword */}
          <input
            className="form-control"
            type="text"
            value={newKeyword}
            onChange={(event) => {
              updateNewKeyword(event.target.value)
            }}
          />
          <button
            type="button"
            className="btn btn-info btn-sm json-editor-btn-add "
            title="Add item"
            onClick={(event) => {
              keywords = [...keywords, newKeyword]
              updateNewKeyword('')
              updatePackage({
                type: 'UPDATE_PACKAGE',
                descriptor: {keywords}
              })
            }}
          >
            Add keyword
          </button>

        </div>
      </div>

    </div>
  )
}


// State

const initialState = ''
const stateName = 'newKeyword'
const stateUpdaterName = 'updateNewKeyword'


// System

module.exports = {
  EditorKeywords: withState(stateName, stateUpdaterName, initialState)(EditorKeywords),
}
