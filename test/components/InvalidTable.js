import React from 'react'
import {assert} from 'chai'
import {shallow} from 'enzyme'
import {InvalidTable} from '../../src/components/InvalidTable'
const report = require('../../data/report.json')


// Tests

describe('InvalidTable', () => {
  it('should render', () => {
    const result = shallow(
      <InvalidTable
        table={report.tables[0]}
        tableNumber={1}
        tablesCount={1}
      />
    )
    assert(result.contains('data/invalid.csv'))
  })
})
