const sinon = require('sinon')
const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const {EditorSchemaPure} = require('../../src/components/EditorSchema')
Enzyme.configure({adapter: new Adapter()})


// Tests

describe('EditorSchemaPure', () => {

  it('should render', () => {
    const descriptor = {
      fields: [{
        name: 'name', type: 'integer', title: 'Title', _key: 'field1'
      }],
      _columns: [{values: ['value1']}],
    }
    const resourceIndex = 2
    const extraColumnsCount = 0
    const onAddFieldClick = sinon.spy()
    const onAddAllFieldsClick = sinon.spy()
    const wrapper = shallow(<EditorSchemaPure
      descriptor={descriptor}
      resourceIndex={resourceIndex}
      extraColumnsCount={extraColumnsCount}
      onAddFieldClick={onAddFieldClick}
      onAddAllFieldsClick={onAddAllFieldsClick}
    />)
    assert(wrapper.contains(' Add field'))
  })

})
