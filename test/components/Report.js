import React from 'react'
import {assert} from 'chai'
import {shallow} from 'enzyme'
import {Report} from '../../src/components/Report'
import {InvalidTable} from '../../src/components/InvalidTable'
const report = require('../../data/report.json')


// Tests

describe('Report', () => {
  it('should render', () => {
    const result = shallow(<Report report={report} />)
    assert(result.contains(
      <InvalidTable
        table={report.tables[0]}
        tableNumber={1}
        tablesCount={1}
      />
    ))
  })
})
