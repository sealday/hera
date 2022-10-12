import _ from 'lodash'
import moment from 'moment'
import {
    Button,
    Form,
    Space,
} from 'antd'

export default ({ namepath }) => {
    const form = Form.useFormInstance()
    const [startDate, endDate] = _.size(form.getFieldValue(namepath)) === 2 ? form.getFieldValue(namepath) : [moment(), moment()]
    const setDate = (v) => form.setFieldValue(namepath, v)
    return <Space direction="horizontal" size={0}>
        <Button type="link" onClick={() => {
            setDate([
                moment().startOf('year'),
                moment().endOf('year').startOf('day'),
            ])
        } }>今年</Button>
        <Button type="link" onClick={() => {
            setDate([
                moment(startDate).add(-1, 'year').startOf('year'),
                moment(endDate).add(-1, 'year').endOf('year').startOf('day'),
            ])
        } }>上一年</Button>
        <Button type="link" onClick={() => {
            setDate([
                moment(startDate).add(1, 'year').startOf('year'),
                moment(endDate).add(1, 'year').endOf('year').startOf('day'),
            ])
        } }>下一年</Button>
        <Button type="link" onClick={() => {
            setDate([
                moment().startOf('day').add(-1, 'month'),
                moment().startOf('day'),
            ])
        } }>近一个月</Button>
        <Button type="link" onClick={() => {
            setDate([
                moment().startOf('day').add(-2, 'month'),
                moment().startOf('day'),
            ])
        } }>近两个月</Button>
    </Space>
}