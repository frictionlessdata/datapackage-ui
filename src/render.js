const React = require('react')
const ReactDOM = require('react-dom')
const thunk = require('redux-thunk').default
const { createStore, applyMiddleware, compose } = require('redux')
const { Provider } = require('react-redux')

// Module API

/**
 * Render component
 *
 * @param {Component} component - it could be one of provided by the library component
 * @param {Object} props - object containing props
 * @param {Element} element - DOM element to render into
 */
function render(Component, props, element) {
  // Prepare component
  let component = Component
  if (component.editorType === 'package') {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const store = createStore(
      component.createReducer(props),
      composeEnhancer(applyMiddleware(thunk))
    )
    component = () => (
      <Provider store={store}>
        <Component />
      </Provider>
    )
  }

  // Render component
  ReactDOM.render(React.createElement(component, props, null), element)
}

// System

module.exports = {
  render,
}
