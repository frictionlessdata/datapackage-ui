const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorMenu} = require('../../src/components/EditorMenu')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorMenu', () => {

  it('should render', () => {
    const result = shallow(<EditorMenu />)
    assert(result.contains('Load data package'))
  })

})
