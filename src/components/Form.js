import React from 'react'
import {Report} from './Report'
import {MessageGroup} from './MessageGroup'
import {merge} from '../helpers'


// Module API

export class Form extends React.Component {

  // Public

  constructor({source, options, validate, reportPromise}) {
    super({source, options, validate, reportPromise})

    // Set state
    this.state = {
      isSourceFile: false,
      isSchemaFile: false,
      isLoading: !!reportPromise,
      source: source || '',
      options: options || {},
      report: null,
      error: null,
    }

    // Load report
    if (this.props.reportPromise) {
      this.props.reportPromise.then(report => {
        this.setState({report, isLoading: false})
      }).catch(error => {
        this.setState({error, isLoading: false})
      })
    }
  }

  render() {
    const {isSourceFile, isSchemaFile, isLoading} = this.state
    const {source, options, report, error} = this.state
    const onSourceTypeChange = this.onSourceTypeChange.bind(this)
    const onSchemaTypeChange = this.onSchemaTypeChange.bind(this)
    const onSourceChange = this.onSourceChange.bind(this)
    const onOptionsChange = this.onOptionsChange.bind(this)
    const onSubmit = this.onSubmit.bind(this)
    return (
      <form className="datapackage-ui-form panel panel-default">

        <div className="row-source">
          <div className="form-inline">
            <label htmlFor="source">Source</label>&nbsp;
            [<a href="#" onClick={() => onSourceTypeChange()}>
              {(isSourceFile) ? 'Provide Link' : 'Upload File'}
            </a>]

            <div className="input-group" style={{width: '100%'}}>
              {!isSourceFile &&
                <input
                  name="source"
                  className="form-control"
                  type="text"
                  value={source}
                  placeholder="http://data.source/url"
                  onChange={ev => onSourceChange(ev.target.value)}
                />
              }

              {isSourceFile &&
                <input
                  name="source"
                  className="form-control"
                  type="file"
                  placeholder="http://data.source/url"
                  onChange={ev => onSourceChange(ev.target.files[0])}
                />
              }

              <div className="input-group-btn" style={{width: '1%'}}>
                <button
                  className="btn btn-success"
                  onClick={ev => {ev.preventDefault(); onSubmit()}}
                >
                  Validate
                </button>
              </div>
            </div>
            <small>
              <strong>[REQUIRED]</strong> Add a data table to validate.
            </small>
          </div>
        </div>

        <div className="row-schema">
          <div className="row">
            <div className="form-group col-md-8">
              <label htmlFor="schema">Schema</label>&nbsp;
              [<a href="#" onClick={() => onSchemaTypeChange()}>
                {(isSchemaFile) ? 'Provide Link' : 'Upload File'}
              </a>]

              {!isSchemaFile &&
                <input
                  type="text"
                  className="form-control"
                  name="schema"
                  value={options.schema}
                  placeholder="http://table.schema/url"
                  onChange={ev => onOptionsChange('schema', ev.target.value)}
                />
              }

              {isSchemaFile &&
                <input
                  type="file"
                  className="form-control"
                  name="schema"
                  placeholder="http://table.schema/url"
                  onChange={ev => onOptionsChange('schema', ev.target.files[0])}
                />
              }
              <small>
                <strong>[OPTIONAL]</strong> Select to validate this data against a Table Schema
                (<a href="http://specs.frictionlessdata.io/table-schema/" target="_blank" rel="noopener noreferrer">
                  What is it?
                </a>).
              </small>
            </div>

            <div className="form-group col-md-2">
              <div className="form-group">
                <label htmlFor="format">Format</label>
                <select
                  name="format"
                  value={options.format}
                  className="form-control"
                  onChange={ev => onOptionsChange('format', ev.target.value)}
                >
                  <option value="">Auto</option>
                  <option value="csv">CSV</option>
                  <option value="gsheet">Google Sheet</option>
                  <option value="json">JSON</option>
                  <option value="ndjson">NDJSON</option>
                  <option value="ods">ODS</option>
                  <option value="tsv">TSV</option>
                  <option value="xls">XLS</option>
                  <option value="xlsx">XLSX</option>
                </select>
              </div>
            </div>

            <div className="col-md-2">
              <div className="form-group">
                <label htmlFor="encoding">Encoding</label>
                <select
                  name="encoding"
                  value={options.encoding}
                  className="form-control"
                  onChange={ev => onOptionsChange('encoding', ev.target.value)}
                >
                  <option value="">Auto</option>
                  <option value="utf-8">UTF-8</option>
                  <option value="ascii">ASCII</option>
                  <option value="iso-8859-2">ISO-8859-2</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="row-flags">
          <div className="row">
            <div className="col-md-4">
              <div className="checkbox">
                <label htmlFor="errorLimit">
                  <input
                    name="errorLimit"
                    type="checkbox"
                    checked={options.errorLimit === 1}
                    onChange={ev => {
                      onOptionsChange('errorLimit', (ev.target.checked) ? 1 : null)
                    }}
                  />
                  Stop on first error
                </label>
              </div>
              <small>
                Indicate whether validation should stop on the first error, or attempt to collect all errors.
              </small>
            </div>

            <div className="col-md-4">
              <div className="checkbox">
                <label htmlFor="ignoreBlankRows">
                  <input
                    name="ignoreBlankRows"
                    type="checkbox"
                    checked={(options.checks || {})['blank-row'] === false}
                    onChange={ev => {
                      if (ev.target.checked) {
                        if (!(options.checks instanceof Object)) options.checks = {}
                        options.checks['blank-row'] = false
                      } else {
                        if (options.checks instanceof Object) {
                          delete options.checks['blank-row']
                        }
                      }
                    }}
                  />
                  Ignore blank rows
                </label>
              </div>
              <small>Indicate whether blank rows should be considered as errors, or simply ignored.</small>
            </div>

            <div className="col-md-4">
              <div className="checkbox">
                <label htmlFor="ignoreDuplicateRows">
                  <input
                    name="ignoreDuplicateRows"
                    type="checkbox"
                    checked={(options.checks || {})['duplicate-row'] === false}
                    onChange={ev => {
                      if (ev.target.checked) {
                        if (!(options.checks instanceof Object)) options.checks = {}
                        options.checks['duplicate-row'] = false
                      } else {
                        if (options.checks instanceof Object) {
                          delete options.checks['duplicate-row']
                        }
                      }
                    }}
                  />
                  Ignore duplicate rows
                </label>
              </div>
              <small>Indicate whether duplicate rows should be considered as errors, or simply ignored.</small>
            </div>
          </div>
        </div>

        {isLoading &&
          <div className="row-message">
            <div className="alert alert-info">
              Loading...
            </div>
          </div>
        }

        {error &&
          <div className="row-message">
            <MessageGroup
              type="warning"
              title={'There is fatal error in validation'}
              expandText="Error details"
              messages={[error.message]}
            />
          </div>
        }

        {report && location.search &&
          <div className="row-message">
            <div className="alert alert-info">
              <strong>Permalink:</strong>&nbsp;
              <a href={location.href}>{location.href}</a>
            </div>
          </div>
        }

        {report &&
          <div className="row-report">
            <Report report={report} />
          </div>
        }

      </form>
    )
  }

  // Private

  onSourceTypeChange() {
    this.setState({isSourceFile: !this.state.isSourceFile})
    this.onSourceChange('')
  }

  onSchemaTypeChange() {
    this.setState({isSchemaFile: !this.state.isSchemaFile})
    this.onOptionsChange('schema', '')
  }

  onSourceChange(value) {
    this.setState({source: value})
  }

  onOptionsChange(key, value) {
    const options = merge(this.state.options, {[key]: value})
    if (!value) delete options[key]
    this.setState({options})
  }

  onSubmit() {
    const {validate} = this.props
    const {source, options} = this.state
    this.setState({report: null, error: null, isLoading: true})
    validate(source, merge(options)).then(report => {
      this.setState({report, isLoading: false})
    }).catch(error => {
      this.setState({error, isLoading: false})
    })
  }

}
