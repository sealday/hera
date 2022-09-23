import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import TransportForm from './TransportForm'
import { useGetRecordQuery, useUpdateTransportMutation } from '../../api'
import { useNavigate, useParams } from 'utils/hooks'
import { Error, Loading, PageHeader } from '../../components'

export default () => {

  const projects = useSelector(state => state.system.projects)
  const { id } = useParams()
  const recordResult = useGetRecordQuery(id)
  const [updateTransport, updateResult] = useUpdateTransportMutation()
  const navigate = useNavigate()
  useEffect(() => {
    if (updateResult.isSuccess) {
      navigate(-1)
    }
  }, [navigate, updateResult.isSuccess])
  let initialValues = {
    'off-date': moment().startOf('day'),
    'arrival-date': moment().startOf('day').add(1, 'day'), // 到达日期
    weight: '', // 重量
    price: '', // 价格
    extraPrice: '', // 附加价格
    payer: '', // 付款方
    payDate: null, // 付款日期
    'pay-info': '', // 付款信息
    payee: '', // 收款人
    bank: '', // 收款人开户行
    account: '', // 收款人账号
    'delivery-party': '', // 发货单位
    'delivery-contact': '', // 发货人
    'delivery-phone': '', // 发货人电话
    'delivery-address': '', // 发货地址
    'receiving-party': '', // 收货单位
    'receiving-contact': '', // 收货联系
    'receiving-phone': '', // 收货人电话
    'receiving-address': '', // 收货地址
    'carrier-party': '', // 运输公司
    'carrier-name': '', // 司机名称
    'carrier-phone': '', // 司机电话
    'carrier-id': '', // 司机身份证号码
    'carrier-car': '', // 车牌号
  }
  if (recordResult.isError) {
    return <Error />
  }

  if (recordResult.isLoading) {
    return <Loading />
  }
  const record = recordResult.data
  const inStock = projects.get(record.inStock)
  const outStock = projects.get(record.outStock)
  let deliveryParty
  let deliveryPhone
  let deliveryContact
  let deliveryAddress
  let receivingParty
  let receivingPhone
  let receivingContact
  let receivingAddress

  receivingParty = inStock.company + inStock.name
  receivingContact = inStock.contacts[0].name
  receivingPhone = inStock.contacts[0].phone
  receivingAddress = inStock.address
  deliveryParty = outStock.company + outStock.name
  deliveryContact = outStock.contacts[0].name
  deliveryPhone = outStock.contacts[0].phone
  deliveryAddress = outStock.address

  console.dir(updateResult)

  if (record.hasTransport) {
    initialValues = {
      ...record.transport,
      'off-date': moment(record.transport['off-date']),
      'arrival-date': moment(record.transport['arrival-date']),
      payDate: record.transport.payDate && moment(record.transport.payDate),
      'delivery-party': deliveryParty, // 发货单位
      'receiving-party': receivingParty, // 收货单位
    }
  } else {
    initialValues = {
      'off-date': moment(record.outDate).startOf('day'),
      'arrival-date': moment(record.outDate).startOf('day').add(1, 'day'), // 到达日期
      'delivery-party': deliveryParty, // 发货单位
      'delivery-contact': deliveryContact, // 发货人
      'delivery-phone': deliveryPhone, // 发货人电话
      'delivery-address': deliveryAddress, // 发货地址
      'receiving-party': receivingParty, // 收货单位
      'receiving-contact': receivingContact, // 收货联系
      'receiving-phone': receivingPhone, // 收货人电话
      'receiving-address': receivingAddress, // 收货地址
      'carrier-car': record.carNumber,
      'payer': deliveryParty,
      'payDate': moment().startOf('day'),
    }
  }

  const handleSubmit = data => {
    data.payee = (data.payee || '').trim()
    updateTransport({ id, transport: data })
  }


  if (initialValues['delivery-party']) {
    return (
      <PageHeader
        title='运输单编辑'
      >
        <TransportForm
          onSubmit={handleSubmit}
          initialValues={initialValues}
          record={record}
          optionA={initialValues['delivery-party']}
          optionB={initialValues['receiving-party']}
        />
      </PageHeader>
    )
  } else {
    return null
  }
}