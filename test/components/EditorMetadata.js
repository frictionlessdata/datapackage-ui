const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorMetadata} = require('../../src/components/EditorMetadata')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorMetadata', () => {

  it('should render', () => {
    const result = shallow(<EditorMetadata />)
    assert(result.contains('Metadata'))
  })

})
