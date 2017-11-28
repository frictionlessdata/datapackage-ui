const React = require('react')
const ReactDOM = require('react-dom')
const thunk = require('redux-thunk').default
const {createStore, applyMiddleware} = require('redux')
const {Provider} = require('react-redux')


// Module API

function render(Component, props, element) {

  // Prepare component
  let component = Component
  if (component.editorType === 'package') {
    const store = createStore(
      component.createReducer(props),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      applyMiddleware(thunk),
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
