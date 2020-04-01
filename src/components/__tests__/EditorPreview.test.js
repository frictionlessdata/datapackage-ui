const React = require('react')
const Enzyme = require('enzyme')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorPreviewPure } = require('../EditorPreview')
Enzyme.configure({ adapter: new Adapter() })

// Tests

test('should render', () => {
  const publicDescriptor = { name: 'name', type: 'integer' }
  const onToggleClick = jest.fn()
  const wrapper = shallow(
    <EditorPreviewPure publicDescriptor={publicDescriptor} onToggleClick={onToggleClick} />
  )
  expect(wrapper.contains('Preview')).toBeTruthy()
})
