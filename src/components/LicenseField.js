const React = require('react')
const { connect } = require('react-redux')
const { OPEN_DEFINITION_LICENSES } = require('../config')

function LicenseFieldPure({
  licenses,

  onLicenseChange,
  onInputChange,
}) {
  const license = (licenses || [])[0] || {}
  const isODLicense = OPEN_DEFINITION_LICENSES[license.name] !== undefined

  return (
    <fieldset>
      <legend className="panel-title">License</legend>
      <label>
        Name
        <select
          name="license-name"
          className="form-control list-container"
          autoComplete="off"
          value={license.name}
          onChange={onLicenseChange}
        >
          <option value="">Choose a license</option>
          {Object.keys(OPEN_DEFINITION_LICENSES).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        Title
        <input
          name="license[title]"
          className="form-control"
          value={license.title || ''}
          placeholder="License title"
          onChange={onInputChange}
          disabled={isODLicense}
        />
      </label>
      <label>
        Path
        <input
          name="license[path]"
          className="form-control"
          value={license.path || ''}
          placeholder="URL to the license's text"
          onChange={onInputChange}
          disabled={isODLicense}
        />
      </label>
    </fieldset>
  )
}

const mapDispatchToProps = (dispatch) => ({
  onLicenseChange: (ev) => {
    dispatch({
      type: 'UPDATE_LICENSE',
      license: OPEN_DEFINITION_LICENSES[ev.target.value],
    })
  },

  onInputChange: (ev) => {
    const license = {}
    const name = ev.target.name
    const value = ev.target.value

    if (name === 'license[path]') {
      license.path = value
    } else if (name === 'license[title]') {
      license.title = value
    }

    dispatch({
      type: 'UPDATE_LICENSE',
      license,
    })
  },
})

const LicenseField = connect(null, mapDispatchToProps)(LicenseFieldPure)

module.exports = {
  // Public
  LicenseField,

  // Private
  LicenseFieldPure,
}
