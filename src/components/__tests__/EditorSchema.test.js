const React = require('react')
const Enzyme = require('enzyme')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorSchemaPure } = require('../EditorSchema')
Enzyme.configure({ adapter: new Adapter() })

// Tests

test('should render', () => {
  const descriptor = {
    fields: [
      {
        name: 'name',
        type: 'integer',
        title: 'Title',
        _key: 'field1',
      },
    ],
    _columns: [{ values: ['value1'] }],
  }
  const resourceIndex = 2
  const extraColumnsCount = 0
  const onAddFieldClick = jest.fn()
  const onAddAllFieldsClick = jest.fn()
  const wrapper = shallow(
    <EditorSchemaPure
      descriptor={descriptor}
      resourceIndex={resourceIndex}
      extraColumnsCount={extraColumnsCount}
      onAddFieldClick={onAddFieldClick}
      onAddAllFieldsClick={onAddAllFieldsClick}
    />
  )
  expect(wrapper.contains('Add field')).toBeTruthy()
})
