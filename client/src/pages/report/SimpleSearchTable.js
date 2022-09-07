import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Map } from 'immutable'
import {
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

import { total_, toFixedWithoutTrailingZero } from '../../utils'

const SimpleSearchTable = ({ search, isCompany }) => {

  const { projects, products, articles, store } = useSelector(state => ({
    projects: state.system.projects,
    products: state.system.products,
    articles: state.system.articles.toArray(),
    store: state.system.store,
  }))

  const getDirection = entry => entry.inStock === store._id ? '入库' : '出库'

  const getOtherSize = entry => {
    return getDirection(entry) === '出库' ? getProjectName(entry.inStock) : getProjectName(entry.outStock)
  }

  const getProjectName = id => {
    const project = projects.get(id)
    return project ? project.company + project.name : '';
  }

  const getTotal = (entries) => {

    let names = new Map()
    entries.forEach(entry => {
      names = names.update(entry.name, 0, total => total + total_(entry, products))
    })

    return names
  }

  let inStore = new Map() // 入库
  let outStore = new Map() // 出库
  let summary = new Map()

  if (search) {
    search.forEach(entry => {
      let totals = []
      getTotal(entry.entries).forEach((v, k) => {
        totals.push(k + '：' + toFixedWithoutTrailingZero(v)) //拼凑显示的字符串

        if (!isCompany) {
          if (getDirection(entry) === '入库') {
            inStore = inStore.update(k, 0, total => total + v)
            summary = summary.update(k, 0, total => total + v)
          } else {
            outStore = outStore.update(k, 0, total => total + v)
            summary = summary.update(k, 0, total => total - v)
          }
        }
      })

      entry.totalString = totals.join(' ')
    })
  }

  const storeRows = []
  if (!isCompany) {
    summary.forEach((v, k) => {
      storeRows.push(<tr key={v}>
        <td>{k}</td>
        <td>{toFixedWithoutTrailingZero(outStore.get(k, 0))}</td>
        <td>{toFixedWithoutTrailingZero(inStore.get(k, 0))}</td>
        <td>{toFixedWithoutTrailingZero(v)}</td>
      </tr>)
    })
  }

  return (
    <div>
      <Card style={{ marginTop: '16px' }}>
        <CardContent>
          <table className="table table-bordered" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>类型</th>
                <th>时间</th>
                <th>车号</th>
                <th>单号</th>
                <th>原始单号</th>
                {isCompany ? <th>出库</th> : <th>项目部</th>}
                {isCompany ? <th>入库</th> : <th>出入库</th>}
                <th>订单内容</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {search && search.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.type}</td>
                  <td>{moment(entry.outDate).format('YYYY-MM-DD')}</td>
                  <td>{entry.carNumber}</td>
                  <td>{entry.number}</td>
                  <td>{entry.originalOrder}</td>
                  {isCompany
                    ? <td>{getProjectName(entry.outStock) || entry.vendor}</td>
                    : <td>{getOtherSize(entry)}</td>
                  }
                  {isCompany
                    ? <td>{getProjectName(entry.inStock) || entry.vendor}</td>
                    : <td>{getDirection(entry)}</td>
                  }
                  <td>{entry.totalString}</td>
                  <td>
                    {isCompany
                      ? <Link to={`/company_record/${entry._id}`}>查看详情</Link>
                      : <Link to={`/record/${entry._id}`}>查看详情</Link>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {!isCompany && storeRows.length > 0 &&
        <Card style={{ marginTop: '16px' }}>
          <CardHeader
            title="结果统计"
          />
          <CardContent>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>出库数量</th>
                  <th>入库数量</th>
                  <th>小计</th>
                </tr>
              </thead>
              <tbody>
                {storeRows}
              </tbody>
            </table>
          </CardContent>
        </Card>
      }
    </div>
  )
}

export default SimpleSearchTable
