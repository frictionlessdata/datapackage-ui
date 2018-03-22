const sinon = require('sinon')
const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorMetadataPure} = require('../../src/components/EditorMetadata')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorMetadataPure', () => {

  it('should render', () => {
    const descriptor = {}
    const onUpdateChange = sinon.spy()
    const result = shallow(<EditorMetadataPure
      descriptor={descriptor}
      onUpdateChange={onUpdateChange}
    />)
    assert(result.contains('Metadata'))
  })

})
