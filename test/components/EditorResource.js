const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorResource} = require('../../src/components/EditorResource')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorResource', () => {

  it('should render', () => {
    const descriptor = {schema: {fields: [{name: 'name', type: 'integer', title: 'Title'}]}}
    const columns = [['value1'], ['value2']]
    const result = shallow(<EditorResource descriptor={descriptor} columns={columns} />)
    assert(result.contains('Title'))
  })

})
