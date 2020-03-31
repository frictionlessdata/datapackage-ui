const sinon = require('sinon')
const React = require('react')
const Enzyme = require('enzyme')
const { assert } = require('chai')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { ContributorFieldPure } = require('../../src/components/ContributorField')
Enzyme.configure({ adapter: new Adapter() })

// Tests

describe('ContributorFieldPure', () => {
  it('should render', () => {
    const contributors = [{ name: 'MIT' }]
    const onInputChange = sinon.spy()
    const wrapper = shallow(
      <ContributorFieldPure contributors={contributors} onInputChange={onInputChange} />
    )
    assert(wrapper.contains('Author'))
  })
})
