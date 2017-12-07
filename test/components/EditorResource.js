const sinon = require('sinon')
const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorResourcePure} = require('../../src/components/EditorResource')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorResourcePure', () => {

  it('should render', () => {
    const descriptor = {}
    const resourceIndex = 2
    const isSettingsActive = false
    const setIsSettingsActive = sinon.spy()
    const onRemoveClick = sinon.spy()
    const onUploadClick = sinon.spy()
    const onUploadChange = sinon.spy()
    const onUpdateChange = sinon.spy()
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
    assert(wrapper.contains('Load'))
  })

})
