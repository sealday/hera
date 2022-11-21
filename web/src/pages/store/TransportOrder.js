import _ from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { toFixedWithoutTrailingZero as fixed, transformArticle, total_, getUnit } from '../../utils'
import PrintFrame from '../../components/print-frame.component'
import { useNavigate, useParams } from 'utils/hooks'
import { useGetRecordQuery } from '../../api'
import { Error, Loading, PageHeader } from '../../components'
import { Card, Result } from 'antd'


export default () => {
  const printFrame = React.createRef()
  const { id } = useParams()
  const navigate = useNavigate()
  const recordResult = useGetRecordQuery(id)
  const record = recordResult.data
  const { articles, config, products } = useSelector(state => ({
    products: state.system.products,
    articles: state.system.articles,
    config: state.system.config,
  }))

  const handleEdit = () => {
    navigate(`/transport/${id}/edit`)
  }

  if (recordResult.isError) {
    return <Error />
  }

  if (recordResult.isLoading) {
    return <Loading />
  }

  const nameArticleMap = transformArticle(articles.valueSeq().toArray()).nameArticleMap

  if (!record.hasTransport) {
    return (
      <PageHeader title="运输单" onEdit={handleEdit}>
        <Card>
          <Result title='还未填写运输单' status='info' />
        </Card>
      </PageHeader>
    )
  }

  const transport = record.transport

  // 计算货物名称及数量
  const getContent = () => {
    let result = []
    record.entries.forEach(entry => {
      const { countUnit } = nameArticleMap[entry.name]
      result.push(`${entry.name}${entry.size} × ${entry.count}${countUnit} = 
        ${fixed(total_(entry, products))}${getUnit(nameArticleMap[entry.name])}`)
    })
    return result
  }

  const getTable = () => {
    const result = []
    const content = getContent()
    for (let i = 0; i < content.length; i += 3) {
      result.push(<tr key={i / 3}>
        <td>{content[i]}</td>
        <td>{content[i + 1]}</td>
        <td>{content[i + 2]}</td>
      </tr>)
    }
    return result
  }

  const inStock = record.inStock
  const outStock = record.outStock

  const PrintContent = () => <>
    <h2 className="text-center">货运运输协议</h2>
    <table className="table table-bordered table--tight table__transport" style={{ width: '100%' }}>
      <tbody>
        <tr>
          <th>日期</th>
          <th>承运日期</th>
          <td>{moment(transport['off-date']).format('YYYY-MM-DD')}</td>
          <th>到货日期</th>
          <td>{moment(transport['arrival-date']).format('YYYY-MM-DD')}</td>
          <th>单号</th>
          <td>{record.number}</td>
          <td rowSpan="12"
            style={{
              width: '1em',
              verticalAlign: 'middle',
            }}>{config.printSideComment}</td>
        </tr>
        <tr>
          <th>货物名称及<br />数量</th>
          <td colSpan="6">
            <table style={{ fontSize: '11px', width: '100%' }}>
              <thead />
              <tbody>{getTable()}</tbody>
            </table>
          </td>
        </tr>
        <tr>
          <th>运输费</th>
          <td>{transport.weight}</td>
          <th>吨/趟</th>
          <th>单价 {transport.price} 元</th>
          <th>附加价格 {_.toNumber(transport.extraPrice ? transport.extraPrice : 0)} 元</th>
          <th>金额</th>
          <td>{fixed(transport.price * transport.weight + _.toNumber(transport.extraPrice ? transport.extraPrice : 0))} 元</td>
        </tr>
        <tr>
          <th rowSpan="2">付款方式及<br />收款人信息</th>
          <th>付款日期</th>
          <th colSpan="2">付款方</th>
          <th>收款人</th>
          <th colSpan="2">收款人账号</th>
        </tr>
        <tr>
          <td>{transport.payDate && moment(transport.payDate).format('YYYY-MM-DD')}</td>
          <td colSpan="2">{transport.payer}</td>
          <td>{transport.payee}</td>
          <td colSpan="2">{transport.bank} {transport.account}</td>
        </tr>
        <tr>
          <th>说明</th>
          <td colSpan="6">本协议一式三联，三方各执一份，单价及吨位按签字确认付款</td>
        </tr>
        {/* 发货方 */}
        <tr>
          <th rowSpan="2">发货方单位<br />发货方地址</th>
          <td colSpan="3">{outStock ? outStock.company + outStock.name : record.vendor}</td>
          <td>{transport['delivery-contact']}</td>
          <td>{transport['delivery-phone']}</td>
          <td rowSpan="2" />
        </tr>
        <tr>
          <td colSpan="3">{outStock ? outStock.address : transport['delivery-address']}</td>
          <td />
          <td />
        </tr>
        {/* 收货方 */}
        <tr>
          <th rowSpan="2">收货方单位<br />收货方地址</th>
          <td colSpan="3">{inStock ? inStock.company + inStock.name : record.vendor}</td>
          <td>{transport['receiving-contact']}</td>
          <td>{transport['receiving-phone']}</td>
          <td rowSpan="2" />
        </tr>
        <tr>
          <td colSpan="3">{inStock ? inStock.address : transport['receiving-address']}</td>
          <td />
          <td />
        </tr>
        {/* 承运方 */}
        <tr>
          <th rowSpan="2">承运方单位<br />驾驶员</th>
          <td colSpan="3">{transport['carrier-party']}</td>
          {/* 占位 */}
          <td><br /></td>
          <td />
          <td rowSpan="2" />
        </tr>
        <tr>
          <td>{transport['carrier-name']}</td>
          <th>身份证</th>
          <td>{transport['carrier-id']}</td>
          <td>{record['carNumber']}</td>
          <td>{transport['carrier-phone']}</td>
        </tr>
      </tbody>
    </table>
  </>

  return (
    <PageHeader title="运输单" onEdit={handleEdit} onPrint={() => printFrame.current.print()}>
      <Card bordered={false}>
        <PrintFrame ref={printFrame}>
          <PrintContent />
        </PrintFrame>
      </Card>
    </PageHeader>
  )
}