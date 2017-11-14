import React from 'react'
import {ErrorGroup} from './ErrorGroup'
import {getTableErrorGroups, removeBaseUrl} from '../helpers'


// Module API

export function InvalidTable({table, tableNumber, tablesCount}) {
  const errorGroups = getTableErrorGroups(table)
  const tableFile = removeBaseUrl(table.source)
  return (
    <div className="report-table">

      <h4 className="file-heading">
        <span>
          <a className="file-name" href={table.source}>{tableFile}</a>
          <span className="file-count">Invalid {tableNumber} of {tablesCount}</span>
        </span>
      </h4>

      {Object.values(errorGroups).map(errorGroup =>
        <ErrorGroup key={errorGroup.code} errorGroup={errorGroup} />
      )}

    </div>
  )
}
