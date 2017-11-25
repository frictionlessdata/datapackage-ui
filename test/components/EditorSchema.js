const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorSchema} = require('../../src/components/EditorSchema')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorSchema', () => {

  it('should render', () => {
    const descriptor = {fields: {name: 'name', type: 'integer', title: 'Title'}}
    const columns = [['value1'], ['value2']]
    const result = shallow(<EditorSchema descriptor={descriptor} columns={columns} />)
  })

})
