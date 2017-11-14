import React from 'react'
import {removeBaseUrl} from '../helpers'
import {InvalidTable} from './InvalidTable'
import {MessageGroup} from './MessageGroup'


// Module API

export function Report({report}) {
  const processedWarnings = getProcessedWarnings(report)
  const validTableFiles = getValidTableFiles(report)
  const invalidTables = getInvalidTables(report)
  return (
    <div className="datapackage-ui-report">

      {!!processedWarnings.length &&
        <MessageGroup
          type="warning"
          title={`There are ${processedWarnings.length} warning(s)`}
          expandText="Warning details"
          messages={processedWarnings}
        />
      }

      {!!validTableFiles.length &&
        <MessageGroup
          type="success"
          title={`There are ${validTableFiles.length} valid table(s)`}
          expandText="Success details"
          messages={validTableFiles}
        />
      }

      {invalidTables.map((table, index) => (
        <InvalidTable
          key={table.source}
          table={table}
          tableNumber={index + 1}
          tablesCount={invalidTables.length}
        />
      ))}

    </div>
  )
}


// Internal

function getProcessedWarnings(report) {
  // Before `datapackage@1.0` there was no warnings property
  return (report.warnings || []).map(warning => removeBaseUrl(warning))
}


function getValidTableFiles(report) {
  return report.tables
    .filter(table => table.valid)
    .map(table => removeBaseUrl(table.source))
}

function getInvalidTables(report) {
  return report.tables.filter(table => !table.valid)
}
