const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorResource} = require('../../src/components/EditorResource')
const {EditorResources} = require('../../src/components/EditorResources')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorResources', () => {

  it('should render', () => {
    const descriptors = [{schema: {fields: [{name: 'name', type: 'integer', title: 'Title'}]}}]
    const columns = [['value1'], ['value2']]
    const result = shallow(<EditorResources descriptors={descriptors} columns={columns} />)
    assert(result.contains(<EditorResource descriptor={descriptors[0]} columns={columns} />))
  })

})
