const {assert} = require('chai')
const {partial} = require('lodash')
const {createReducer} = require('../../src/reducers/editorPackage')


describe('editorPackage', () => {
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
      const descriptor = {
        keywords: ['foo'],
      }

      const newState = reducer({descriptor}, {keyword: descriptor.keywords[0]})

      assert.doesNotHaveAnyKeys(newState.publicDescriptor, ['keywords'])
    })
  })

  describe('UPDATE_LICENSE', () => {
    const reducer = partial(_dispatch, 'UPDATE_LICENSE')

    it('removes license if called with undefined', () => {
      const descriptor = {
        licenses: [{name: 'CC-0'}],
      }

      const newState = reducer({descriptor}, {license: undefined})

      assert.doesNotHaveAnyKeys(newState.publicDescriptor, ['licenses'])
    })
  })

  describe('UPDATE_CONTRIBUTORS', () => {
    const reducer = partial(_dispatch, 'UPDATE_CONTRIBUTORS')

    it('removes contributors if called with undefined', () => {
      const descriptor = {
        contributors: [{title: 'J Smith'}],
      }

      const newState = reducer({descriptor}, {contributors: undefined})

      assert.doesNotHaveAnyKeys(newState.publicDescriptor, ['contributors'])
    })
  })
})


function _dispatch(action, state, payload) {
  return createReducer({})(state, {type: action, ...payload})
}
