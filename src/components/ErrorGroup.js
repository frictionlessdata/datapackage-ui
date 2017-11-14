import React from 'react'
import marked from 'marked'
import classNames from 'classnames'
import startCase from 'lodash/startCase'
const spec = require('../spec.json')


// Module API

export class ErrorGroup extends React.Component {

  // Public

  constructor({errorGroup}) {
    super({errorGroup})
    this.state = {
      showErrorDetails: false,
      visibleRowsCount: 10,
    }
  }

  render() {
    const {errorGroup} = this.props
    const {showErrorDetails, visibleRowsCount} = this.state
    const errorDetails = getErrorDetails(errorGroup)
    const showHeaders = getShowHeaders(errorDetails)
    const description = getDescription(errorDetails)
    const rowNumbers = getRowNumbers(errorGroup)
    return (
      <div className="result panel panel-danger">

        <div className="panel-heading">
          <span className="text-uppercase label label-danger">Invalid</span>
          <span className="text-uppercase label label-info">{errorDetails.type}</span>
          <span className="count label">{errorGroup.count}</span>
          <h5 className="panel-title">
            <a onClick={() => this.setState({showErrorDetails: !showErrorDetails})}>
              {errorDetails.name}
            </a>
          </h5>
          <a className="error-details-link" onClick={() => this.setState({showErrorDetails: !showErrorDetails})}>
            Error details
          </a>
        </div>

        {showErrorDetails && description &&
          <div className="panel-heading error-details">
            <p><div dangerouslySetInnerHTML={{__html: description}} /></p>
          </div>
        }

        {showErrorDetails &&
          <div className="panel-heading error-details">
            <p>The full list of error messages:</p>
            <ul>
              {errorGroup.messages.map(message =>
                <li>{message}</li>
              )}
            </ul>
          </div>
        }

        <div className="panel-body">
          <div className="table-container">
            <table className="table table-bordered table-condensed">
              {errorGroup.headers && showHeaders &&
                <ErrorGroupTableHead headers={errorGroup.headers} />
              }
              <ErrorGroupTableBody
                errorGroup={errorGroup}
                visibleRowsCount={visibleRowsCount}
                rowNumbers={rowNumbers}
              />
            </table>
          </div>
          {(visibleRowsCount < rowNumbers.length) &&
            <div className="show-more">
              <a onClick={() => {this.setState({visibleRowsCount: visibleRowsCount + 10})}}>
                Show next 10 rows
              </a>
            </div>
          }
        </div>
      </div>
    )
  }
}


// Internal

function ErrorGroupTableHead({headers}) {
  return (
    <thead>
      <tr>
        <th />
        {headers.map(header =>
          <th>{header}</th>
        )}
      </tr>
    </thead>
  )
}


function ErrorGroupTableBody({errorGroup, visibleRowsCount, rowNumbers}) {
  return (
    <tbody>
      {rowNumbers.map((rowNumber, index) => (
        (index < visibleRowsCount) &&
          <tr className="result-header-row">
            {(rowNumber !== null) &&
              <td className="result-row-index">{rowNumber}</td>
            }
            {errorGroup.rows[rowNumber].values.map((value, innerIndex) =>
              <td className={classNames({danger: errorGroup.rows[rowNumber].badcols.has(innerIndex + 1)})}>
                {value}
              </td>
            )}
          </tr>
      ))}
    </tbody>
  )
}


function getErrorDetails(errorGroup) {

  // Get code handling legacy codes
  let code = errorGroup.code
  if (code === 'non-castable-value') {
    code = 'type-or-format-error'
  }

  // Get details handling custom errors
  let details = spec.errors[code]
  if (!details) details = {
    name: startCase(code),
    type: 'custom',
    context: 'body',
    description: null,
  }

  return details
}


function getShowHeaders(errorDetails) {
  return errorDetails.context === 'body'
}


function getDescription(errorDetails) {
  let description = errorDetails.description
  if (description) {
    description = description.replace('{validator}', '`goodtables.yml`')
    description = marked(description)
  }
  return description
}


function getRowNumbers(errorGroup) {
  return Object.keys(errorGroup.rows)
    .map(item => parseInt(item, 10) || null)
    .sort((a, b) => a - b)
}
