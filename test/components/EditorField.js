const React = require('react')
const Enzyme = require('enzyme')
const {assert} = require('chai')
const {shallow} = require('enzyme')
import Adapter from 'enzyme-adapter-react-15.4'
import {EditorField} from '../../src/components/EditorField'
Enzyme.configure({adapter: new Adapter()});


// Tests

describe('EditorField', () => {

  it('should render', () => {
    const descriptor = {name: 'name', type: 'integer'}
    const result = shallow(<EditorField descriptor={descriptor} />)
    assert(result.contains('Field'))
  })

})
