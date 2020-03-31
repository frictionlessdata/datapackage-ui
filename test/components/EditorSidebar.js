const sinon = require('sinon')
const React = require('react')
const Enzyme = require('enzyme')
const { assert } = require('chai')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorSidebarPure } = require('../../src/components/EditorSidebar')
Enzyme.configure({ adapter: new Adapter() })

// Tests

describe('EditorSidebarPure', () => {
  it('should render', () => {
    const descriptor = {}
    const publicDescriptor = {}
    const onUploadChange = sinon.spy()
    const onValidateClick = sinon.spy()
    const wrapper = shallow(
      <EditorSidebarPure
        descriptor={descriptor}
        publicDescriptor={publicDescriptor}
        onUploadChange={onUploadChange}
        onValidateClick={onValidateClick}
      />
    )
    assert(wrapper.contains('Load data package'))
  })
})
