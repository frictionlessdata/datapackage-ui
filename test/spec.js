const axios = require('axios')
const {assert} = require('chai')
const spec = require('../src/spec.json')


// Tests

describe('spec', () => {

  it('should be up-to-date', async () => {
    const res = await axios.get('https://raw.githubusercontent.com/frictionlessdata/data-quality-spec/master/spec.json')
    assert.deepEqual(spec, res.data)
  })

})
