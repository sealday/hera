import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { removeProject } from '../actions'

class Project extends React.Component {

  componentDidMount() {
    const query  = this.props.location.query
    if (query.id) {
      document.getElementById(query.id).scrollIntoView()
    }
  }

  render() {
    let { projects, onDeleteClick } = this.props
    return (
      <div>
        <table className="table table-bordered">
          <thead>
          <tr>
            <th rowSpan="2">公司名称</th>
            <th rowSpan="2">公司电话</th>
            <th rowSpan="2">项目部名称</th>
            <th rowSpan="2">项目部电话</th>
            <th rowSpan="2">项目部地址</th>
            <th colSpan="2">联系人</th>
            <th rowSpan="2">仓库类型</th>
            <th rowSpan="2">备注</th>
            <th rowSpan="2">操作</th>
          </tr>
          <tr>
            <th>姓名</th>
            <th>电话</th>
          </tr>
          </thead>
          <tbody>
          {projects.valueSeq().map(project => (
            project.contacts.map((contact, index) => {
              if (index === 0) {
                const rowSpan = project.contacts.length
                return (
                  <tr key={project._id} id={project._id}>
                    <td rowSpan={rowSpan}>{project.company}</td>
                    <td rowSpan={rowSpan}>{project.companyTel}</td>
                    <td rowSpan={rowSpan}>{project.name}</td>
                    <td rowSpan={rowSpan}>{project.tel}</td>
                    <td rowSpan={rowSpan}>{project.address}</td>
                    <td>{contact.name}</td>
                    <td>{contact.phone}</td>
                    <td rowSpan={rowSpan}>{project.type}</td>
                    <td rowSpan={rowSpan}>{project.comments}</td>
                    <td rowSpan={rowSpan}>
                      <Link className='btn btn-default' to={`/project/${project._id}/edit`} >编辑</Link>
                      <a className="btn btn-danger" href="#" onClick={e => onDeleteClick(e, project )}>删除</a>
                    </td>
                  </tr>
                )
              } else {
                return (
                  <tr key={project._id + index}>
                    <td>{contact.name}</td>
                    <td>{contact.phone}</td>
                  </tr>
                )
              }
            })
          ))}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    projects: state.system.projects
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
