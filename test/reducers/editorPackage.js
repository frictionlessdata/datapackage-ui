const {assert} = require('chai')
const {partial} = require('lodash')
const {createReducer, _processState} = require('../../src/reducers/editorPackage')


describe('editorPackage', () => {

  describe('_processState', () => {

    it('adds empty lists of keywords and resources', () => {
      const state = {descriptor: {}}
      const newState = _processState(state)
      assert.deepEqual(newState.descriptor, {keywords: [], resources: []})
    })

    it('does not raises if resource has no schema', () => {
      const state = {descriptor: {resources: [{name: 'foo'}]}}
      const newState = _processState(state)
      assert.include(newState.descriptor.resources[0], state.descriptor.resources[0])
    })

    it('removes auxiliar resources attributes', () => {
      const state = {
        descriptor: {
          resources: [
            {
              name: 'foo',
              _key: 'foo',
              schema: {
                _columns: 'foo',
                fields: [
                  {_key: 'foo'}
                ]
              }
            },
          ]
        }
      }
      const newState = _processState(state)
      const resource = newState.publicDescriptor.resources[0]
      assert.doesNotHaveAnyKeys(resource, ['_key'])
      assert.doesNotHaveAnyKeys(resource.schema, ['_columns'])
      assert.doesNotHaveAnyKeys(resource.schema.fields[0], ['_key'])
    })

  })

  describe('UPDATE_PACKAGE', () => {
    const reducer = partial(_dispatch, 'UPDATE_PACKAGE')

    it('removes empty attributes', () => {
      const descriptor = {}
      const newState = reducer({descriptor}, {name: ''})
      assert.doesNotHaveAnyKeys(newState.publicDescriptor, ['name'])
    })

  })

  describe('REMOVE_KEYWORD', () => {
    const reducer = partial(_dispatch, 'REMOVE_KEYWORD')

    it('removes keywords array if there are no keywords left', () => {
      const descriptor = {keywords: ['foo']}
      const newState = reducer({descriptor}, {keyword: descriptor.keywords[0]})
      assert.doesNotHaveAnyKeys(newState.publicDescriptor, ['keywords'])
    })

  })

  describe('UPDATE_LICENSE', () => {
    const reducer = partial(_dispatch, 'UPDATE_LICENSE')

    it('removes license if called with undefined', () => {
      const descriptor = {licenses: [{name: 'CC-0'}]}
      const newState = reducer({descriptor}, {license: undefined})
      assert.doesNotHaveAnyKeys(newState.publicDescriptor, ['licenses'])
    })

  })

  describe('UPDATE_CONTRIBUTORS', () => {
    const reducer = partial(_dispatch, 'UPDATE_CONTRIBUTORS')

    it('removes contributors if called with undefined', () => {
      const descriptor = {contributors: [{title: 'J Smith'}]}
      const newState = reducer({descriptor}, {contributors: undefined})
      assert.doesNotHaveAnyKeys(newState.publicDescriptor, ['contributors'])
    })

  })

  describe.skip('VALIDATE_PACKAGE', () => {
    const reducer = partial(_dispatch, 'VALIDATE_PACKAGE')

    it('validates package', () => {
      const publicDescriptor = {resources: []}
      const newState = reducer({publicDescriptor}, {})
      assert.deepEqual(newState.feedback, {})
    })

  })

  describe('ADD_RESOURCE', () => {
    const reducer = partial(_dispatch, 'ADD_RESOURCE')

    it('adds resource', () => {
      const descriptor = {resources: []}
      const newState = reducer({descriptor}, {})
      assert.deepEqual(newState.publicDescriptor.resources.length, 1)
    })

  })

  describe('REMOVE_RESOURCE', () => {
    const reducer = partial(_dispatch, 'REMOVE_RESOURCE')

    it('removes resource', () => {
      const descriptor = {
        resources: [{name: 'name1'}]
      }
      const newState = reducer({descriptor}, {resourceIndex: 0})
      assert.deepEqual(newState.publicDescriptor, {})
    })

  })

  describe('REMOVE_FIELD', () => {
    const reducer = partial(_dispatch, 'REMOVE_FIELD')

    it('removes field', () => {
      const descriptor = {
        resources: [{ name: 'resource1', schema: {fields: [{name: 'field1'}]}}]
      }
      const newState = reducer({descriptor}, {resourceIndex: 0, fieldIndex: 0})
      assert.deepEqual(newState.publicDescriptor.resources[0].schema, {})
    })

  })

  describe('UPDATE_FIELD', () => {
    const reducer = partial(_dispatch, 'UPDATE_FIELD')

    it('updates field', () => {
      const descriptor = {
        resources: [{ name: 'resource1', schema: {fields: [{name: 'field1'}]}}]
      }
      const payload = {name: 'field2'}
      const newState = reducer({descriptor}, {resourceIndex: 0, fieldIndex: 0, payload})
      assert.deepEqual(newState.publicDescriptor.resources[0].schema.fields[0].name, 'field2')
    })

  })

  describe('ADD_KEYWORD', () => {
    const reducer = partial(_dispatch, 'ADD_KEYWORD')

    it('adds keyword', () => {
      const descriptor = {keywords: ['kw1', 'kw2']}
      const newState = reducer({descriptor}, {keyword: 'kw3'})
      assert.deepEqual(newState.publicDescriptor.keywords, ['kw1', 'kw2', 'kw3'])
    })

  })

  describe('UPDATE_KEYWORD', () => {
    const reducer = partial(_dispatch, 'UPDATE_KEYWORD')

    it('updates keyword', () => {
      const descriptor = {keywords: ['kw1', 'kw2']}
      const newState = reducer({descriptor}, {keyword: 'kw2', newKeyword: 'kw3'})
      assert.deepEqual(newState.publicDescriptor.keywords, ['kw1', 'kw3'])
    })

  })

})


function _dispatch(action, state, payload) {
  return createReducer({})(state, {type: action, ...payload})
}
