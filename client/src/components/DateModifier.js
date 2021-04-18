import React from 'react'

import moment from 'moment'
import {
    Button,
    Space,
} from 'antd'

const DateModifier = ({ setDate, date }) => <Space direction="horizontal" size={0}>
    <Button type="link" onClick={() => {
        setDate([
            moment().startOf('year'),
            moment().endOf('year').startOf('day'),
        ])
    }}>今年</Button>
    <Button type="link" onClick={() => {
        setDate([
            moment(date).add(-1, 'year').startOf('year'),
            moment(date).add(-1, 'year').endOf('year').startOf('day'),
        ])
    }}>上一年</Button>
    <Button type="link" onClick={() => {
        setDate([
            moment(date).add(1, 'year').startOf('year'),
            moment(date).add(1, 'year').endOf('year').startOf('day'),
        ])
    }}>下一年</Button>
    <Button type="link" onClick={() => {
        setDate([
            moment().startOf('day').add(-1, 'month'),
            moment().startOf('day'),
        ])
    }}>近一个月</Button>
    <Button type="link" onClick={() => {
        setDate([
            moment().startOf('day').add(-2, 'month'),
            moment().startOf('day'),
        ])
    }}>近两个月</Button>
</Space>
export default DateModifier