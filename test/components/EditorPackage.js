const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorPackage} = require('../../src/components/EditorPackage')
const {EditorMenu} = require('../../src/components/EditorMenu')
const {EditorResources} = require('../../src/components/EditorResources')
const {EditorPreview} = require('../../src/components/EditorPreview')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorPackage', () => {

  it('should render', () => {
    const descriptor = {resources: [{schema: {fields: [{title: 'Test1'}]}}]}
    const columns = [['value1'], ['value2']]
    const result = shallow(<EditorPackage descriptor={descriptor} />)
    assert(result.contains(<EditorMenu />))
    // assert(result.contains(<EditorResources descriptors={descriptor.resources} columns={columns} />))
    assert(result.contains(<EditorPreview />))
  })

})
