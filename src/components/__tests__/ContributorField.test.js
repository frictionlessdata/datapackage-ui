const React = require('react')
const Enzyme = require('enzyme')
const { shallow } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { ContributorFieldPure } = require('../ContributorField')
Enzyme.configure({ adapter: new Adapter() })

// Tests

test('should render', () => {
  const contributors = [{ name: 'MIT' }]
  const onInputChange = jest.fn()
  const wrapper = shallow(
    <ContributorFieldPure contributors={contributors} onInputChange={onInputChange} />
  )
  expect(wrapper.contains('Author')).toBeTruthy()
})
