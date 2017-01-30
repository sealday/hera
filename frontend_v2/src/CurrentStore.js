/**
 * Created by seal on 30/01/2017.
 */

import React from 'react'
import { connect } from 'react-redux'

class CurrentStore extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      project: '',
      base: props.system.base._id,
    }
  }

  onProjectChange = (value) => {
    this.setState({
      project: value,
    })
  }

  onBaseChange = (value) => {
    this.setState({
      base: value,
    })
  }

  render() {
    const props = this.props
    return (
      <div>
        <h2>管理入口</h2>
        <div className="row">
          <div className="col-xs-6">
            <Select
              value={this.state.base}
              placeholder='选择仓库'
              onChange={e => this.onBaseChange(e.value)}
              clearable={false}
              options={props.system.projects.filter(project => project.type === '基地仓库').toArray().map(project => ({ value: project._id, label: project.company + project.name}))}
            />
            <button className="btn btn-default btn-block">总部管理</button>
          </div>
          <div className="col-xs-6">
            <Select
              value={this.state.project}
              placeholder='选择项目'
              onChange={e => this.onProjectChange(e.value)}
              clearable={false}
              options={props.system.projects.filter(project => project.type === '项目部仓库').toArray().map(project => ({ value: project._id, label: project.company + project.name}))}
            />
            <button className="btn btn-default btn-block">项目部管理</button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  system: state.system
})

export default connect(mapStateToProps)(CurrentStore)