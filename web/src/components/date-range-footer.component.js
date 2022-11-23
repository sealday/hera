import _ from 'lodash'
import dayjs from 'dayjs'
import {
    Button,
    Form,
    Space,
} from 'antd'

export default ({ namepath }) => {
    const form = Form.useFormInstance()
    const [startDate, endDate] = _.size(form.getFieldValue(namepath)) === 2 ? form.getFieldValue(namepath) : [dayjs(), dayjs()]
    const setDate = (v) => form.setFieldValue(namepath, v)
    return <Space direction="horizontal" size={0}>
        <Button type="link" onClick={() => {
            setDate([
                dayjs().startOf('year'),
                dayjs().endOf('year').startOf('day'),
            ])
        } }>今年</Button>
        <Button type="link" onClick={() => {
            setDate([
                dayjs(startDate).add(-1, 'year').startOf('year'),
                dayjs(endDate).add(-1, 'year').endOf('year').startOf('day'),
            ])
        } }>上一年</Button>
        <Button type="link" onClick={() => {
            setDate([
                dayjs(startDate).add(1, 'year').startOf('year'),
                dayjs(endDate).add(1, 'year').endOf('year').startOf('day'),
            ])
        } }>下一年</Button>
        <Button type="link" onClick={() => {
            setDate([
                dayjs().startOf('day').add(-1, 'month'),
                dayjs().startOf('day'),
            ])
        } }>近一个月</Button>
        <Button type="link" onClick={() => {
            setDate([
                dayjs().startOf('day').add(-2, 'month'),
                dayjs().startOf('day'),
            ])
        } }>近两个月</Button>
    </Space>
}