// Module API

export function getTableErrorGroups(table) {
  const groups = {}
  for (const error of table.errors) {

    // Get group
    let group = groups[error.code]

    // Create group
    if (!group) {
      group = {
        code: error.code,
        rows: {},
        count: 0,
        headers: table.headers,
        messages: [],
      }
    }

    // Get row
    let row = group.rows[error['row-number']]

    // Create row
    if (!row) {
      let values = error.row
      if (!error['row-number']) {
        values = table.headers
      }
      row = {
        values,
        badcols: new Set(),
      }
    }

    // Ensure missing value
    if (error.code === 'missing-value') {
      row.values[error['column-number'] - 1] = ''
    }

    // Add row badcols
    if (error['column-number']) {
      row.badcols.add(error['column-number'])
    } else if (row.values) {
      row.badcols = new Set(row.values.map((value, index) => index + 1))
    }

    // Save group
    group.count += 1
    group.messages.push(error.message)
    group.rows[error['row-number']] = row
    groups[error.code] = group

  }
  return groups
}


export function removeBaseUrl(text) {
  return text.replace(/https:\/\/raw\.githubusercontent\.com\/\S*?\/\S*?\/\S*?\//g, '')
}


export function merge(...args) {
  return Object.assign({}, ...args)
}
