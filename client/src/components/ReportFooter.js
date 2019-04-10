import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'

import { toFixedWithoutTrailingZero as fixed } from '../utils'

const ReportFooter = ({ report, noWeight }) => (
  <List>
    {report.map((report, index) => (
      <ListItem divider={true} dense={true} key={index}>
        {noWeight ?
          <ListItemText primary={`${report.name} ${report.total} ${report.unit}`}/>
          :
          <ListItemText primary={`
        ${report.name} ${report.total} ${report.unit}
        ${report.weight === 0 ? ' *' : ' ' + fixed(report.weight / 1000, 3)} 吨
        `}/>
        }
      </ListItem>
    ))}
  </List>
)

export default ReportFooter
