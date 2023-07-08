import React, { useContext } from 'react'
import { Descriptions, Form } from 'antd'
import { SettingContext } from '../../../records/index'
import heraApi from '../../../../../api'
import _ from 'lodash'
import { toFixedWithoutTrailingZero as fixed } from '../../../../../utils/index'
import { convertDetailInfos } from '../../utils/convert'

export const Summary = () => {
  const form = Form.useFormInstance()
  const settings = useContext(SettingContext)

  const detailInfos = form.getFieldValue('detailInfos')
  const { entries } = convertDetailInfos(detailInfos)

  const result = heraApi.useGetProductListQuery()
  if (_.isUndefined(entries)) {
    return ''
  }
  // 排除空值
  const validEntries = _.filter(
    entries,
    entry =>
      !_.isUndefined(entry) &&
      !_.isEmpty(entry.product) &&
      !_.isUndefined(entry.count) &&
      (!settings.price || !_.isUndefined(entry.price))
  )
  if (result.isError || result.isLoading || validEntries.length === 0) {
    return ''
  }
  // 关联数据
  const equippedEntries = validEntries
    .map(entry => ({
      ...result.data.find(
        item =>
          item.type === entry.product[0] &&
          item.name === entry.product[1] &&
          item.size === entry.product[2]
      ),
      ...entry,
    }))
    .filter(item => !_.isUndefined(item.weight))
  // 计算结果
  const calculatedEntries = equippedEntries.map(item => ({
    ...item,
    total: item.isScaled ? item.count * item.scale : item.count,
    sum: (item.isScaled ? item.count * item.scale : item.count) * item.price,
    weight: (item.count * item.weight) / 1000,
  }))
  // reduce
  const initialValues = { 理论重量: { count: 0, unit: '吨' } }
  if (settings.price) {
    initialValues['总金额'] = { count: 0, unit: '元' }
  }
  const resultEntries = _.reduce(
    calculatedEntries,
    (result, item) => {
      if (_.isUndefined(result[`${item.type}|${item.name}`])) {
        result[`${item.type}|${item.name}`] = {
          count: 0,
          unit: item.isScaled ? item.unit : item.countUnit,
        }
      }
      result[`${item.type}|${item.name}`].count += item.total
      if (settings.price) {
        result['总金额'].count += item.sum
      }
      result['理论重量'].count += item.weight
      return result
    },
    initialValues
  )
  const items = _.map(resultEntries, (v, k) => (
    <Descriptions.Item key={k} label={k}>
      {fixed(v.count)}
      {v.unit}
    </Descriptions.Item>
  ))
  return <Descriptions title="小结">{items}</Descriptions>
}
