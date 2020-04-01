const React = require('react')
const Enzyme = require('enzyme')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorMetadataPure } = require('../EditorMetadata')
Enzyme.configure({ adapter: new Adapter() })

// Tests

test('should render', () => {
  const descriptor = {}
  const onUpdateChange = jest.fn()
  const result = shallow(
    <EditorMetadataPure descriptor={descriptor} onUpdateChange={onUpdateChange} />
  )
  expect(result.contains('Metadata')).toBeTruthy()
})
