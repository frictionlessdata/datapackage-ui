const React = require('react')
const {connect} = require('react-redux')
const partial = require('lodash/partial')
const {withProps, withState} = require('recompose')


// Components

function EditorKeywords({

  // Props
  keywords,

  // State
  newKeyword,
  setNewKeyword,

  // Handlers
  onAddKeywordClick,
  onRemoveKeywordClick,
  onUpdateKeywordChange,

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
          {keywords.map((keyword, index) => (
            <p key={index}>

              {/* Update keyword */}
              <input
                type="text"
                defaultValue={keyword}
                className="form-control"
                onBlur={partial(onUpdateKeywordChange, keyword)}
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
            placeholder="Type keyword"
            onChange={(ev) => {
              setNewKeyword(ev.target.value)
            }}
          />
          <button
            type="button"
            className="btn btn-info btn-sm json-editor-btn-add "
            title="Add item"
            disabled={!newKeyword}
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


// Computers

function computeProps({keywords}) {

  // Keywords
  keywords = keywords || []

  return {keywords}
}


// State

const stateName = 'newKeyword'
const stateUpdaterName = 'setNewKeyword'
const initialState = ''


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

EditorKeywords = withProps(computeProps)(EditorKeywords)
EditorKeywords = withState(stateName, stateUpdaterName, initialState)(EditorKeywords)
EditorKeywords = connect(null, mapDispatchToProps)(EditorKeywords)


// System

module.exports = {
  EditorKeywords,
}
