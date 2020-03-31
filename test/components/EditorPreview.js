const sinon = require('sinon')
const React = require('react')
const Enzyme = require('enzyme')
const { assert } = require('chai')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorPreviewPure } = require('../../src/components/EditorPreview')
Enzyme.configure({ adapter: new Adapter() })

// Tests

describe('EditorPreviewPure', () => {
  it('should render', () => {
    const publicDescriptor = { name: 'name', type: 'integer' }
    const onToggleClick = sinon.spy()
    const wrapper = shallow(
      <EditorPreviewPure publicDescriptor={publicDescriptor} onToggleClick={onToggleClick} />
    )
    assert(wrapper.contains('Preview'))
  })
})
