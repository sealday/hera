import React from 'react'

import dayjs from 'dayjs'
import {
    Button,
    Space,
} from 'antd'

const DateModifier = ({ setDate, date }) => <Space direction="horizontal" size={0}>
    <Button type="link" onClick={() => {
        setDate([
            dayjs().startOf('year'),
            dayjs().endOf('year').startOf('day'),
        ])
    }}>今年</Button>
    <Button type="link" onClick={() => {
        setDate([
            dayjs(date).add(-1, 'year').startOf('year'),
            dayjs(date).add(-1, 'year').endOf('year').startOf('day'),
        ])
    }}>上一年</Button>
    <Button type="link" onClick={() => {
        setDate([
            dayjs(date).add(1, 'year').startOf('year'),
            dayjs(date).add(1, 'year').endOf('year').startOf('day'),
        ])
    }}>下一年</Button>
    <Button type="link" onClick={() => {
        setDate([
            dayjs().startOf('day').add(-1, 'month'),
            dayjs().startOf('day'),
        ])
    }}>近一个月</Button>
    <Button type="link" onClick={() => {
        setDate([
            dayjs().startOf('day').add(-2, 'month'),
            dayjs().startOf('day'),
        ])
    }}>近两个月</Button>
</Space>
export default DateModifier