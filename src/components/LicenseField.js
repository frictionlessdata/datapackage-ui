const React = require('react')
const { connect } = require('react-redux')

// Pure components

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

// Handlers

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

// Settings

const OPEN_DEFINITION_LICENSES = {
  'CC0-1.0': {
    name: 'CC0-1.0',
    title: 'CC0 1.0',
    path: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  'CC-BY-4.0': {
    name: 'CC-BY-4.0',
    title: 'Creative Commons Attribution 4.0',
    path: 'https://creativecommons.org/licenses/by/4.0/',
  },
  'CC-BY-SA-4.0': {
    name: 'CC-BY-SA-4.0',
    title: 'Creative Commons Attribution Share-Alike 4.0',
    path: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'CC-BY-NC-4.0': {
    name: 'CC-BY-NC-4.0',
    title: 'Creative Commons Attribution-NonCommercial 4.0',
    path: 'https://creativecommons.org/licenses/by-nc/4.0/',
  },
  'ODC-BY-1.0': {
    name: 'ODC-BY-1.0',
    title: 'Open Data Commons Attribution License 1.0',
    path: 'http://www.opendefinition.org/licenses/odc-by',
  },
  'ODC-PDDL-1.0': {
    name: 'ODC-PDDL-1.0',
    title: 'Open Data Commons Public Domain Dedication and Licence 1.0',
    path: 'http://www.opendefinition.org/licenses/odc-pddl',
  },
  'ODbL-1.0': {
    name: 'ODbL-1.0',
    title: 'Open Data Commons Open Database License 1.0',
    path: 'http://www.opendefinition.org/licenses/odc-odbl',
  },
  'OGL-UK-2.0': {
    name: 'OGL-UK-2.0',
    title: 'Open Government Licence 2.0 (United Kingdom)',
    path: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/',
  },
  'OGL-UK-3.0': {
    name: 'OGL-UK-3.0',
    title: 'Open Government Licence 3.0 (United Kingdom)',
    path: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  },
}

// Components

const LicenseField = connect(null, mapDispatchToProps)(LicenseFieldPure)

// System

module.exports = {
  // Public
  LicenseField,

  // Private
  LicenseFieldPure,
}
