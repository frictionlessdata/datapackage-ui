const React = require('react')
const Enzyme = require('enzyme')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorKeywordsPure } = require('../EditorKeywords')
Enzyme.configure({ adapter: new Adapter() })

// Tests

test('should render', () => {
  const keywords = ['keyword1', 'keyword2']
  const newKeyword = 'keyword3'
  const setNewKeyword = jest.fn()
  const onAddKeywordClick = jest.fn()
  const onRemoveKeywordClick = jest.fn()
  const onUpdateKeywordChange = jest.fn()
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
  expect(wrapper.contains('Keywords')).toBeTruthy()
})
