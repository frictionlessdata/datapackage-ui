const React = require('react')
const Enzyme = require('enzyme')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorResourcePure } = require('../EditorResource')
Enzyme.configure({ adapter: new Adapter() })

// Tests

test('should render', () => {
  const descriptor = {}
  const resourceIndex = 2
  const isSettingsActive = false
  const setIsSettingsActive = jest.fn()
  const onRemoveClick = jest.fn()
  const onUploadClick = jest.fn()
  const onUploadChange = jest.fn()
  const onUpdateChange = jest.fn()
  const wrapper = shallow(
    <EditorResourcePure
      descriptor={descriptor}
      resourceIndex={resourceIndex}
      isSettingsActive={isSettingsActive}
      setIsSettingsActive={setIsSettingsActive}
      onRemoveClick={onRemoveClick}
      onUploadClick={onUploadClick}
      onUploadChange={onUploadChange}
      onUpdateChange={onUpdateChange}
    />
  )
  expect(wrapper.contains('Load')).toBeTruthy()
})
