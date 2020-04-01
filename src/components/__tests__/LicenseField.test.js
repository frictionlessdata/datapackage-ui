const React = require('react')
const Enzyme = require('enzyme')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { LicenseFieldPure } = require('../LicenseField')
Enzyme.configure({ adapter: new Adapter() })

// Tests

test('should render', () => {
  const licenses = [{ name: 'MIT' }]
  const onLicenseChange = jest.fn()
  const onInputChange = jest.fn()
  const wrapper = shallow(
    <LicenseFieldPure
      licenses={licenses}
      onLicenseChange={onLicenseChange}
      onInputChange={onInputChange}
    />
  )
  expect(wrapper.contains('Name')).toBeTruthy()
})
