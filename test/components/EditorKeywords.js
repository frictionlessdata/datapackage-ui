const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorKeywords} = require('../../src/components/EditorKeywords')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorKeywords', () => {

  it('should render', () => {
    const result = shallow(<EditorKeywords />)
    assert(result.contains('Keywords'))
  })

})
