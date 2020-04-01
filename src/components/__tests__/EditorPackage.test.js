const React = require('react')
const Enzyme = require('enzyme')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { EditorPackagePure } = require('../EditorPackage')
Enzyme.configure({ adapter: new Adapter() })

// Tests

test('should render', () => {
  const isPreviewActive = false
  const publicDescriptor = {}
  const descriptor = { resources: [] }
  const feedback = {}
  const onAddResourceClick = jest.fn()
  const result = shallow(
    <EditorPackagePure
      isPreviewActive={isPreviewActive}
      publicDescriptor={publicDescriptor}
      descriptor={descriptor}
      feedback={feedback}
      onAddResourceClick={onAddResourceClick}
    />
  )
  expect(result.contains('Add resource')).toBeTruthy()
})
