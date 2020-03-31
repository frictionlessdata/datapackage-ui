const sinon = require('sinon')
const React = require('react')
const Enzyme = require('enzyme')
const { assert } = require('chai')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorFieldPure } = require('../../src/components/EditorField')
Enzyme.configure({ adapter: new Adapter() })

// Tests

describe('EditorFieldPure', () => {
  it('should render', () => {
    const column = { values: ['value1', 'value2', 'value3'] }
    const descriptor = { name: 'name', type: 'integer', title: 'Title' }
    const onRemoveClick = sinon.spy()
    const onUpdateChange = sinon.spy()
    const wrapper = shallow(
      <EditorFieldPure
        column={column}
        descriptor={descriptor}
        onRemoveClick={onRemoveClick}
        onUpdateChange={onUpdateChange}
      />
    )
    assert(wrapper.contains('value1'))
    assert(wrapper.contains('value2'))
    assert(wrapper.contains('value3'))
  })
})
