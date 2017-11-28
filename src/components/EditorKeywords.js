const React = require('react')
const {connect} = require('react-redux')
const partial = require('lodash/partial')
const {withState} = require('recompose')


// Components

function EditorKeywords({

  // Props
  keywords,

  // Handlers
  onAddKeywordClick,
  onRemoveKeywordClick,
  onUpdateKeywordChange,

  // State
  newKeyword,
  setNewKeyword,

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
                type="text"
                value={keyword}
                className="form-control"
                onChange={partial(onUpdateKeywordChange, keyword)}
              />

              {/* Remove keyword */}
              <button
                type="button"
                title="Add item"
                className="btn btn-info btn-sm json-editor-btn-add "
                onClick={partial(onRemoveKeywordClick, keyword)}
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
            onChange={(ev) => {
              setNewKeyword(ev.target.value)
            }}
          />
          <button
            type="button"
            className="btn btn-info btn-sm json-editor-btn-add "
            title="Add item"
            onClick={(ev) => {
              onAddKeywordClick(newKeyword, ev)
              setNewKeyword('')
            }}
          >
            Add keyword
          </button>

        </div>
      </div>

    </div>
  )
}


// Handlers

const mapDispatchToProps = (dispatch, ownProps) => ({

  onAddKeywordClick:
    (keyword, ev) => {
      dispatch({
        type: 'ADD_KEYWORD',
        keyword,
      })
    },

  onRemoveKeywordClick:
    (keyword, ev) => {
      dispatch({
        type: 'REMOVE_KEYWORD',
        keyword,
      })
    },

  onUpdateKeywordChange:
    (keyword, ev) => {
      dispatch({
        type: 'UPDATE_KEYWORD',
        keyword,
        newKeyword: ev.target.value,
      })
    },

})


// Wrappers

EditorKeywords = withState('newKeyword', 'setNewKeyword', '')(EditorKeywords)
EditorKeywords = connect(null, mapDispatchToProps)(EditorKeywords)


// System

module.exports = {
  EditorKeywords,
}
