const React = require('react')
const Enzyme = require('enzyme')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorFieldPure } = require('../EditorField')
Enzyme.configure({ adapter: new Adapter() })

// Tests

test('should render', () => {
  const column = { values: ['value1', 'value2', 'value3'] }
  const descriptor = { name: 'name', type: 'integer', title: 'Title' }
  const onRemoveClick = jest.fn()
  const onUpdateChange = jest.fn()
  const wrapper = shallow(
    <EditorFieldPure
      column={column}
      descriptor={descriptor}
      onRemoveClick={onRemoveClick}
      onUpdateChange={onUpdateChange}
    />
  )
  expect(wrapper.contains('value1')).toBeTruthy()
  expect(wrapper.contains('value2')).toBeTruthy()
  expect(wrapper.contains('value3')).toBeTruthy()
})
