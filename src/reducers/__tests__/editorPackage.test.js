const { partial } = require('lodash')
const { createReducer, _processState } = require('../editorPackage')

// Tests

test('adds empty lists of keywords and resources', () => {
  const state = { descriptor: {} }
  const newState = _processState(state)
  expect(newState.descriptor).toEqual({ keywords: [], resources: [] })
})

test('does not raises if resource has no schema', () => {
  const state = { descriptor: { resources: [{ name: 'foo' }] } }
  const newState = _processState(state)
  expect(newState.descriptor.resources[0]).toEqual(state.descriptor.resources[0])
})

test('removes auxiliar resources attributes', () => {
  const state = {
    descriptor: {
      resources: [
        {
          name: 'foo',
          _key: 'foo',
          schema: {
            _columns: 'foo',
            fields: [{ _key: 'foo' }],
          },
        },
      ],
    },
  }
  const newState = _processState(state)
  const resource = newState.publicDescriptor.resources[0]
  expect(resource).not.toHaveProperty('_key')
  expect(resource.schema).not.toHaveProperty('_columns')
  expect(resource.schema.fields[0]).not.toHaveProperty('_key')
})

test('removes empty attributes', () => {
  const reducer = partial(_dispatch, 'UPDATE_PACKAGE')
  const descriptor = {}
  const newState = reducer({ descriptor }, { name: '' })
  expect(newState.publicDescriptor).not.toHaveProperty('name')
})

test('removes keywords array if there are no keywords left', () => {
  const reducer = partial(_dispatch, 'REMOVE_KEYWORD')
  const descriptor = { keywords: ['foo'] }
  const newState = reducer({ descriptor }, { keyword: descriptor.keywords[0] })
  expect(newState.publicDescriptor).not.toHaveProperty('keywords')
})

test('removes license if called with undefined', () => {
  const reducer = partial(_dispatch, 'UPDATE_LICENSE')
  const descriptor = { licenses: [{ name: 'CC-0' }] }
  const newState = reducer({ descriptor }, { license: undefined })
  expect(newState.publicDescriptor).not.toHaveProperty('licenses')
})

test('removes contributors if called with undefined', () => {
  const reducer = partial(_dispatch, 'UPDATE_CONTRIBUTORS')
  const descriptor = { contributors: [{ title: 'J Smith' }] }
  const newState = reducer({ descriptor }, { contributors: undefined })
  expect(newState.publicDescriptor).not.toHaveProperty('contributors')
})

test.skip('validates package', () => {
  const reducer = partial(_dispatch, 'VALIDATE_PACKAGE')
  const publicDescriptor = { resources: [] }
  const newState = reducer({ publicDescriptor }, {})
  expect(newState.feedback).toEqual({})
})

test('adds resource', () => {
  const reducer = partial(_dispatch, 'ADD_RESOURCE')
  const descriptor = { resources: [] }
  const newState = reducer({ descriptor }, {})
  expect(newState.publicDescriptor.resources.length).toEqual(1)
})

test('removes resource', () => {
  const reducer = partial(_dispatch, 'REMOVE_RESOURCE')
  const descriptor = {
    resources: [{ name: 'name1' }],
  }
  const newState = reducer({ descriptor }, { resourceIndex: 0 })
  expect(newState.publicDescriptor).toEqual({})
})

// TODO: review this test
test('uploads data', () => {
  const reducer = partial(_dispatch, 'UPLOAD_DATA')
  const descriptor = { resources: [{ name: 'name1', schema: { fields: [], _columns: [] } }] }
  const headers = ['id', 'name']
  const rows = [
    [1, 'name1'],
    [2, 'name2'],
    [3, 'name3'],
  ]
  const newState = reducer({ descriptor }, { resourceIndex: 0, headers, rows })
  expect(newState.publicDescriptor).toEqual({
    resources: [
      {
        name: 'name1',
        profile: 'tabular-data-resource',
        schema: {},
      },
    ],
  })
})

// TODO: review this test
test('updates schema', () => {
  const reducer = partial(_dispatch, 'UPDATE_SCHEMA')
  const descriptor = { resources: [{ name: 'resource1', schema: {} }] }
  const payload = { missingValues: [''] }
  const newState = reducer({ descriptor }, { resourceIndex: 0, payload })
  expect(newState.publicDescriptor.resources[0].schema).toEqual({})
})

test('adds field', () => {
  const reducer = partial(_dispatch, 'ADD_FIELD')
  const descriptor = { resources: [{ name: 'resource1', schema: { fields: [] } }] }
  const newState = reducer({ descriptor }, { resourceIndex: 0, payload: { name: 'field1' } })
  expect(newState.publicDescriptor.resources[0].schema.fields[0].name).toEqual('field1')
})

test('removes field', () => {
  const reducer = partial(_dispatch, 'REMOVE_FIELD')
  const descriptor = {
    resources: [{ name: 'resource1', schema: { fields: [{ name: 'field1' }] } }],
  }
  const newState = reducer({ descriptor }, { resourceIndex: 0, fieldIndex: 0 })
  expect(newState.publicDescriptor.resources[0].schema).toEqual({})
})

test('updates field', () => {
  const reducer = partial(_dispatch, 'UPDATE_FIELD')
  const descriptor = {
    resources: [{ name: 'resource1', schema: { fields: [{ name: 'field1' }] } }],
  }
  const payload = { name: 'field2' }
  const newState = reducer({ descriptor }, { resourceIndex: 0, fieldIndex: 0, payload })
  expect(newState.publicDescriptor.resources[0].schema.fields[0].name).toEqual('field2')
})

test('adds keyword', () => {
  const reducer = partial(_dispatch, 'ADD_KEYWORD')
  const descriptor = { keywords: ['kw1', 'kw2'] }
  const newState = reducer({ descriptor }, { keyword: 'kw3' })
  expect(newState.publicDescriptor.keywords).toEqual(['kw1', 'kw2', 'kw3'])
})

test('updates keyword', () => {
  const reducer = partial(_dispatch, 'UPDATE_KEYWORD')
  const descriptor = { keywords: ['kw1', 'kw2'] }
  const newState = reducer({ descriptor }, { keyword: 'kw2', newKeyword: 'kw3' })
  expect(newState.publicDescriptor.keywords).toEqual(['kw1', 'kw3'])
})

// Helpers

function _dispatch(action, state, payload) {
  return createReducer({})(state, { type: action, ...payload })
}
