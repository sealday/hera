/**
 * Created by seal on 20/01/2017.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import { requestRecord } from '../actions'
import { toFixedWithoutTrailingZero as fixed, transformArticle, total_, isUpdatable, getUnit } from '../utils'
import config from './../config'


class TransportOrder extends Component {
  handleEdit = () => {
    this.props.router.push(`/transport/${this.props.router.params.id}/edit`)
  }

  handleBack = () => {
    this.props.router.goBack()
  }

  componentDidMount() {
    const record = this.props.record
    if (!record) {
      this.props.dispatch(requestRecord(this.props.id))
    }
  }

  render() {
    const { record, nameArticleMap, user, store } = this.props
    if (!record) {
      return <div>请求运输单！</div>
    }

    if (!record.hasTransport) {
      return  (
        <Card>
          <CardHeader
            action={
              <div>
                <Button onClick={this.handleBack}>返回</Button>
                <Button onClick={this.handleEdit} color="primary">填写运输单</Button>
              </div>
            }
          />
          <CardContent>
            <Typography variant="headline">还未填写运输单！</Typography>
          </CardContent>
        </Card>
      )
    }

    const transport = record.transport

    // 计算货物名称及数量
    const getContent = () => {
      let result = []
      record.entries.forEach(entry => {
        const {countUnit} = nameArticleMap[entry.name]
        result.push(`${entry.name}${entry.size} × ${entry.count}${countUnit} = 
        ${fixed(total_(entry, this.props.products))}${getUnit(nameArticleMap[entry.name])}`)
      })
      return result
    }

    const getTable = () => {
      let result = []
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

    const projects = this.props.projects
    const inStock = projects.get(record.inStock)
    const outStock = projects.get(record.outStock)

    return (
      <div>
        <div className="hidden-print" style={{ display: 'flex' }}>
          <span style={{ flex: 1 }} />
          <Button onClick={this.handleBack}>返回</Button>
          {isUpdatable(store, user) && <Button onClick={this.handleEdit}>编辑</Button>}
          <Button color="primary" onClick={e => window.print()}>打印</Button>
        </div>
        <h2 className="text-center">货运运输协议</h2>
        <table className="table table-bordered table--tight table__transport">
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
                }}>{config.print.side}</td>
          </tr>
          <tr>
            <th>货物名称及<br/>数量</th>
            <td colSpan="6">
              <table style={{fontSize: '11px', width: '100%'}}>
                <thead/>
                <tbody>{getTable()}</tbody>
              </table>
            </td>
          </tr>
          <tr>
            <th>运输费</th>
            <td>{transport.weight}</td>
            <th>吨/趟</th>
            <th>单价</th>
            <td>{transport.price} 元</td>
            <th>金额</th>
            <td>{fixed(transport.price * transport.weight)} 元</td>
          </tr>
          <tr>
            <th rowSpan="2">付款方式及<br/>收款人信息</th>
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
            <th rowSpan="2">发货方单位<br/>发货方地址</th>
            <td colSpan="3">{outStock ? outStock.company + outStock.name : record.vendor}</td>
            <td>{transport['delivery-contact']}</td>
            <td>{transport['delivery-phone']}</td>
            <td rowSpan="2"/>
          </tr>
          <tr>
            <td colSpan="3">{outStock ? outStock.address : transport['delivery-address']}</td>
            <td/>
            <td/>
          </tr>
          {/* 收货方 */}
          <tr>
            <th rowSpan="2">收货方单位<br/>收货方地址</th>
            <td colSpan="3">{inStock ? inStock.company + inStock.name : record.vendor}</td>
            <td>{transport['receiving-contact']}</td>
            <td>{transport['receiving-phone']}</td>
            <td rowSpan="2"/>
          </tr>
          <tr>
            <td colSpan="3">{inStock ? inStock.address : transport['receiving-address']}</td>
            <td/>
            <td/>
          </tr>
          {/* 承运方 */}
          <tr>
            <th rowSpan="2">承运方单位<br/>驾驶员</th>
            <td colSpan="3">{transport['carrier-party']}</td>
            {/* 占位 */}
            <td><br/></td>
            <td/>
            <td rowSpan="2"/>
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
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const id = props.params.id
  const record = state.store.records.get(id)
  return {
    record,
    id,
    projects: state.system.projects,
    products: state.system.products,
    ...transformArticle(state.system.articles.toArray()),
    user: state.system.user,
    store: state.system.store,
  }
}

export default connect(mapStateToProps)(TransportOrder);
