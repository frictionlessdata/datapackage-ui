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


// System

module.exports = {
  EDITOR_UPLOAD_ROWS_LIMIT,
  FIELD_TYPES_AND_FORMATS,
}
