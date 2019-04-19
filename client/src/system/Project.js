import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import { Select } from '../components'
import { removeProject } from '../actions'

const ProjectFilterForm = reduxForm({
  form: 'ProjectFilterForm',
  initialValues: {
    type: '项目部仓库',
  },
})(() =>  <Field
  component={Select}
  name="type"
  label="项目类型"
>
  <option value="全部">全部</option>
  <option value="基地仓库">基地仓库</option>
  <option value="第三方仓库">第三方仓库</option>
  <option value="项目部仓库">项目部仓库</option>
  <option value="供应商">供应商</option>
  <option value="承运商">承运商</option>
</Field>)

class Project extends React.Component {

  render() {
    let { projects, onDeleteClick, projectType } = this.props
    return (
      <Card>
        <CardHeader
          title="项目列表"
          action={<>
            <Button component={Link} to="/project/create">新增</Button>
          </>}
        />
        <CardContent>
          <ProjectFilterForm/>
        </CardContent>
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
                <TableCell rowSpan="2">仓库类型</TableCell>
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
              .filter(project => projectType === '全部' || projectType === project.type)
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
                          <Button variant="text" onClick={e => onDeleteClick(e, project )} color="secondary">删除</Button>
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
    )
  }
}

const selector = formValueSelector('ProjectFilterForm')
const mapStateToProps = state => {
  return {
    projects: state.system.projects,
    projectType: selector(state, 'type'),
  }
}

const mapDispatchToProps = dispatch => ({
  onDeleteClick(e, project) {
    e.preventDefault()
    if (window.confirm(`确定要删除项目 ${project.company} ${project.name}`)) {
      alert('暂时不支持删除项目！')
      dispatch(removeProject(project._id))
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Project)
