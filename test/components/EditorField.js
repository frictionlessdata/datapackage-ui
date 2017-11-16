const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorField} = require('../../src/components/EditorField')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorField', () => {

  it('should render', () => {
    const descriptor = {name: 'name', type: 'integer', title: 'Title'}
    const column = ['value1']
    const result = shallow(<EditorField descriptor={descriptor} column={column} />)
    assert(result.contains('Title'))
  })

})
