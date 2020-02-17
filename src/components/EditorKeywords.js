const React = require('react')
const {connect} = require('react-redux')
const partial = require('lodash/partial')
const {withState} = require('recompose')


// Pure components

function EditorKeywordsPure({

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
          Keywords
        </h4>
      </div>

      <div
        id="keywords"
        aria-labelledby="keywords-heading"
      >
        <div className="panel-body">

          {/* List keywords */}
          {keywords.map((keyword) => (
            <p key={keyword}>

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


// State

const stateName = 'newKeyword'
const stateUpdaterName = 'setNewKeyword'
const initialState = ''


// Handlers

const mapDispatchToProps = (dispatch) => ({

  onAddKeywordClick:
    (keyword) => {
      dispatch({
        type: 'ADD_KEYWORD',
        keyword,
      })
    },

  onRemoveKeywordClick:
    (keyword) => {
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


// Components

let EditorKeywords = withState(stateName, stateUpdaterName, initialState)(EditorKeywordsPure)
EditorKeywords = connect(null, mapDispatchToProps)(EditorKeywords)


// System

module.exports = {

  // Public
  EditorKeywords,

  // Private
  EditorKeywordsPure,

}
