const React = require('react')
const {connect} = require('react-redux')


function ContributorFieldPure({
  contributors,

  onInputChange,
}) {
  const authors = (contributors || []).filter((contributor) => contributor.role === 'author')
  const emptyAuthor = {
    role: 'author',
  }
  const author = authors[0] || emptyAuthor

  return (
    <label className="control-label">
      Author
      <input
        className="form-control"
        name="contributors[title]"
        type="text"
        defaultValue={author.title}
        placeholder="J Bloggs"
        onBlur={onInputChange}
      />
    </label>
  )
}


const mapDispatchToProps = (dispatch) => ({
  onInputChange:
    (ev) => {
      const author = {
        title: ev.target.value,
        role: 'author',
      }
      let contributors

      if (author.title !== '') {
        contributors = [author]
      }

      dispatch({
        type: 'UPDATE_CONTRIBUTORS',
        contributors,
      })
    }
})

const ContributorField = connect(null, mapDispatchToProps)(ContributorFieldPure)

module.exports = {

  // Public
  ContributorField,

}
