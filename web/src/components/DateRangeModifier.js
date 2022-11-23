import React from 'react'
import dayjs from 'dayjs'
import { Button, ConfigProvider } from 'antd'

const DateRangeModifier = ({ change, key_start, key_end, current }) => (
  <ConfigProvider componentSize='small'>
    <Button
      type='text'
      onClick={() => {
        change(key_start, dayjs().startOf('year'))
        change(key_end, dayjs().endOf('year').startOf('day'))
      }}
    >今年</Button>
    <Button
      type='text'
      onClick={() => {
        change(key_start, dayjs(current).add(-1, 'year').startOf('year'))
        change(key_end, dayjs(current).add(-1, 'year').endOf('year').startOf('day'))
      }}
    >上一年</Button>
    <Button
      type='text'
      onClick={() => {
        change(key_start, dayjs(current).add(1, 'year').startOf('year'))
        change(key_end, dayjs(current).add(1, 'year').endOf('year').startOf('day'))
      }}
    >下一年</Button>
    <Button
      type='text'
      onClick={() => {
        change(key_start, dayjs().startOf('day').add(-1, 'month'))
        change(key_end, dayjs().startOf('day'))
      }}
    >最近一个月</Button>
    <Button
      type='text'
      onClick={() => {
        change(key_start, dayjs().startOf('day').add(-2, 'month'))
        change(key_end, dayjs().startOf('day'))
      }}
    >两个月</Button>
  </ConfigProvider>
)

export default DateRangeModifier
