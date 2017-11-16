const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorPreview} = require('../../src/components/EditorPreview')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorPreview', () => {

  it('should render', () => {
    const descriptor = {name: 'name', type: 'integer'}
    const result = shallow(<EditorPreview descriptor={descriptor} />)
    assert(result.contains('Preview'))
  })

})
