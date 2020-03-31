// Editor

const EDITOR_UPLOAD_ROWS_LIMIT = 100
const FIELD_TYPES_AND_FORMATS = {
  string: ['default', 'email', 'uri', 'binary', 'uuid'],
  number: ['default'],
  integer: ['default'],
  boolean: ['default'],
  object: ['default'],
  array: ['default'],
  date: false,
  time: false,
  datetime: false,
  year: ['default'],
  yearmonth: ['default'],
  duration: ['default'],
  geopoint: ['default', 'array', 'object'],
  geojson: ['default', 'topojson'],
  any: ['default'],
}
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

// System

module.exports = {
  EDITOR_UPLOAD_ROWS_LIMIT,
  FIELD_TYPES_AND_FORMATS,
  OPEN_DEFINITION_LICENSES,
}
