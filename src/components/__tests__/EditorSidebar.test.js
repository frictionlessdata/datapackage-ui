const React = require('react')
const Enzyme = require('enzyme')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorSidebarPure } = require('../EditorSidebar')
Enzyme.configure({ adapter: new Adapter() })

// Tests

test('should render', () => {
  const descriptor = {}
  const publicDescriptor = {}
  const onUploadChange = jest.fn()
  const onValidateClick = jest.fn()
  const wrapper = shallow(
    <EditorSidebarPure
      descriptor={descriptor}
      publicDescriptor={publicDescriptor}
      onUploadChange={onUploadChange}
      onValidateClick={onValidateClick}
    />
  )
  expect(wrapper.contains('Upload')).toBeTruthy()
})
