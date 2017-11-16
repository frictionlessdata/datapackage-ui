const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorField} = require('../../src/components/EditorField')
const {EditorFields} = require('../../src/components/EditorFields')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorFields', () => {

  it('should render', () => {
    const descriptors = [{name: 'name', type: 'integer', title: 'Title'}]
    const columns = [['value1'], ['value2']]
    const result = shallow(<EditorFields descriptors={descriptors} columns={columns} />)
    assert(result.contains(<EditorField descriptor={descriptors[0]} column={columns[0]} />))
  })

})
