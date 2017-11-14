import React from 'react'
import {assert} from 'chai'
import {shallow} from 'enzyme'
import {ErrorGroup} from '../../src/components/ErrorGroup'
import {getTableErrorGroups} from '../../src/helpers'
const report = require('../../data/report.json')


// Tests

describe('ErrorGroup', () => {
  it('should render', () => {
    const errorGroup = getTableErrorGroups(report.tables[0])['blank-header']
    const result = shallow(<ErrorGroup errorGroup={errorGroup} />)
    assert(result.contains('Blank Header'))
  })
})
