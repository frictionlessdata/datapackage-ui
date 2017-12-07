const sinon = require('sinon')
const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorPackagePure} = require('../../src/components/EditorPackage')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorPackagePure', () => {

  it('should render', () => {
    const isPreviewActive = false
    const publicDescriptor = {}
    const descriptor = {resources: []}
    const feedback = {}
    const onAddResourceClick = sinon.spy()
    const result = shallow(
      <EditorPackagePure
        isPreviewActive={isPreviewActive}
        publicDescriptor={publicDescriptor}
        descriptor={descriptor}
        feedback={feedback}
        onAddResourceClick={onAddResourceClick}
      />
    )
    assert(result.contains('Add resource'))
  })

})
