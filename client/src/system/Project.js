import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tab,
  Tabs,
} from '@material-ui/core'
import {
  Popconfirm,
} from 'antd'
import 'antd/lib/popconfirm/style'

import {
  updateProject,
  removeProject,
} from '../actions'
import {
  wrapper,
  TAB2TYPE,
  DEFAULT_TAB_INDEX,
  ajax,
} from '../utils'

const btnStatusName = project => {
  if (project.status === 'FINISHED') {
    return '启用'
  } else {
    return '禁用'
  }
}

class Project extends React.Component {

  state = {
    tab: DEFAULT_TAB_INDEX,
  }
  render() {
    let { projects, onDeleteClick, onStatusChange } = this.props
    return (
      <>
        <Card style={{ minHeight: '120px' }}>
          <CardHeader
            title="客户管理"
            action={<>
              <Button component={Link} to="/project/create">新增</Button>
            </>}
          />
        </Card>
        <AppBar position="static">
          <Tabs
            value={this.state.tab}
            onChange={(e, tab) => this.setState({ tab })}
          >
            {TAB2TYPE.map((name, i) => (
              <Tab key={i} label={name} />
            ))}
          </Tabs>
        </AppBar>
        <Card>
          <CardContent>
            <Table padding="dense">
              <TableHead>
                <TableRow>
                  <TableCell rowSpan="2">公司名称</TableCell>
                  <TableCell rowSpan="2">公司电话</TableCell>
                  <TableCell rowSpan="2">项目部名称</TableCell>
                  <TableCell rowSpan="2">项目部电话</TableCell>
                  <TableCell rowSpan="2">项目部地址</TableCell>
                  <TableCell colSpan="2">联系人</TableCell>
                  <TableCell rowSpan="2">类型</TableCell>
                  <TableCell rowSpan="2">备注</TableCell>
                  <TableCell rowSpan="2">操作</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>姓名</TableCell>
                  <TableCell>电话</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.toArray()
                  .filter(project => TAB2TYPE[this.state.tab] === project.type)
                  .map(project => (
                    project.contacts.map((contact, index) => {
                      if (index === 0) {
                        const rowSpan = project.contacts.length
                        return (
                          <TableRow key={project._id} id={project._id}>
                            <TableCell rowSpan={rowSpan}>{project.company}</TableCell>
                            <TableCell rowSpan={rowSpan}>{project.companyTel}</TableCell>
                            <TableCell rowSpan={rowSpan}>{project.name}</TableCell>
                            <TableCell rowSpan={rowSpan}>{project.tel}</TableCell>
                            <TableCell rowSpan={rowSpan}>{project.address}</TableCell>
                            <TableCell>{contact.name}</TableCell>
                            <TableCell>{contact.phone}</TableCell>
                            <TableCell rowSpan={rowSpan}>{project.type}</TableCell>
                            <TableCell rowSpan={rowSpan}>{project.comments}</TableCell>
                            <TableCell rowSpan={rowSpan}>
                              <Button to={`/project/${project._id}/edit`} component={Link} variant="text">编辑</Button>
                              <Popconfirm
                                title={`确定要删除？`}
                                onConfirm={() => onDeleteClick(project)}
                              >
                                <Button variant="text" color="secondary">删除</Button>
                              </Popconfirm>
                              <Popconfirm
                                title={`确定要暂时${btnStatusName(project)}？`}
                                onConfirm={() => onStatusChange(project)}
                              >
                                <Button variant="text" color="secondary">{btnStatusName(project)}</Button>
                              </Popconfirm>
                            </TableCell>
                          </TableRow>
                        )
                      } else {
                        return (
                          <TableRow key={project._id + index}>
                            <TableCell>{contact.name}</TableCell>
                            <TableCell>{contact.phone}</TableCell>
                          </TableRow>
                        )
                      }
                    })
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    projects: state.system.rawProjects,
  }
}

const mapDispatchToProps = dispatch => ({
  onDeleteClick(project) {
    ajax(`/api/project/${project._id}/delete`, { method: 'POST' })
      .then(res => dispatch(removeProject(res.data.project._id)))
  },
  onStatusChange(project) {
    ajax(`/api/project/${project._id}/status`, {
      method: 'POST',
      data: JSON.stringify({ status: project.status === 'FINISHED' ? 'UNDERWAY' : 'FINISHED' }),
    })
      .then(res => {
        dispatch(updateProject(res.data.project))
      })
  }
})

export default wrapper([
  connect(mapStateToProps, mapDispatchToProps),
  Project,
])
