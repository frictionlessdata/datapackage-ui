import React from 'react'


// Module API

export class MessageGroup extends React.Component {

  // Public

  constructor({type, title, messages, expandText}) {
    super({type, title, messages, expandText})
    this.state = {
      isExpanded: false,
    }
  }

  render() {
    const {type, title, messages, expandText} = this.props
    const {isExpanded} = this.state
    return (
      <div className={`alert alert-${type}`} role="alert">
        <span className="title" onClick={() => this.setState({isExpanded: !isExpanded})}>
          {title}
        </span>
        <a className="show-details" onClick={() => this.setState({isExpanded: !isExpanded})}>
          {expandText}
        </a>
        {isExpanded &&
          <div>
            <hr />
            <ul>
              {messages.map(message =>
                <li>{message}</li>
              )}
            </ul>
          </div>
        }
      </div>
    )
  }
}
