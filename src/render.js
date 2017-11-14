import React from 'react'
import ReactDOM from 'react-dom'


// Module API

export function render(component, props, element) {
  ReactDOM.render(React.createElement(component, props, null), element)
}
