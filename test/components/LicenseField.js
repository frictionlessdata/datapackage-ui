const sinon = require('sinon')
const React = require('react')
const Enzyme = require('enzyme')
const { assert } = require('chai')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { LicenseFieldPure } = require('../../src/components/LicenseField')
Enzyme.configure({ adapter: new Adapter() })

// Tests

describe('LicenseFieldPure', () => {
  it('should render', () => {
    const licenses = [{ name: 'MIT' }]
    const onLicenseChange = sinon.spy()
    const onInputChange = sinon.spy()
    const wrapper = shallow(
      <LicenseFieldPure
        licenses={licenses}
        onLicenseChange={onLicenseChange}
        onInputChange={onInputChange}
      />
    )
    assert(wrapper.contains('Name'))
  })
})
