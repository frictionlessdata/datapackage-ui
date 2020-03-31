const sinon = require('sinon')
const React = require('react')
const Enzyme = require('enzyme')
const { assert } = require('chai')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorKeywordsPure } = require('../../src/components/EditorKeywords')
Enzyme.configure({ adapter: new Adapter() })

// Tests

describe('EditorKeywordsPure', () => {
  it('should render', () => {
    const keywords = ['keyword1', 'keyword2']
    const newKeyword = 'keyword3'
    const setNewKeyword = sinon.spy()
    const onAddKeywordClick = sinon.spy()
    const onRemoveKeywordClick = sinon.spy()
    const onUpdateKeywordChange = sinon.spy()
    const wrapper = shallow(
      <EditorKeywordsPure
        keywords={keywords}
        newKeyword={newKeyword}
        setNewKeyword={setNewKeyword}
        onAddKeywordClick={onAddKeywordClick}
        onRemoveKeywordClick={onRemoveKeywordClick}
        onUpdateKeywordChange={onUpdateKeywordChange}
      />
    )
    assert(wrapper.contains('Keywords'))
  })
})
