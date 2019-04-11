import React from 'react'
import moment from 'moment'
import {
  Button,
} from '@material-ui/core'

const DateRangeModifier = ({ change, key_start, key_end }) => (
  <>
    <Button
      onClick={() => {
        change(key_start, moment().startOf('year'))
        change(key_end, moment().startOf('day'))
      }}
    >今年</Button>
    <Button
      onClick={() => {
        change(key_start, moment().startOf('day').add(-1, 'month'))
        change(key_end, moment().startOf('day'))
      }}
    >最近一个月</Button>
    <Button onClick={() => {
      change(key_start, moment().startOf('day').add(-2, 'month'))
      change(key_end, moment().startOf('day'))
    }}
    >两个月</Button>
  </>
)

export default DateRangeModifier
