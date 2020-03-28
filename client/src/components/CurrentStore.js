import React from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'
import {
  Button,
} from '@material-ui/core'

import { selectStore } from '../actions'
import { filterOption, STORE2TYPE } from '../utils'

class CurrentStore extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      project: '',
      base: props.system.base._id,
      type: '基地仓库',
      other: '',
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

  onOtherChange = (value) => {
    this.setState({
      other: value,
    })
  }

  onBaseSelect = () => {
    this.props.dispatch(selectStore(this.props.config, this.props.system.projects.get(this.state.base)))
  }

  onProjectSelect = () => {
    this.props.dispatch(selectStore(this.props.config, this.props.system.projects.get(this.state.project)))
  }

  onOtherSelect = () => {
    this.props.dispatch(selectStore(this.props.config, this.props.system.projects.get(this.state.other)))
  }

  onStoreTypeChange = type => {
    const { base } = this.props.system;
    // TODO 暂时特殊处理基地仓库，之后可以根据频率优化或者配置优化
    if (type === '基地仓库') {
      this.setState({ type: type, base: base._id })
    } else {
      this.setState({ type: type, base: '' })
    }
  }

  render() {
    const { projects, user } = this.props.system;
    let filteredProjects = projects;
    if (user.role === '项目部管理员' || user.role === '基地仓库管理员') {
      const perms = user.perms || [];
      const userProjects = perms.filter((p) => p.query).map((p) => p.projectId);
      filteredProjects = projects.filter((project) => userProjects.indexOf(project._id) !== -1);
    }
    return (
      <div style={{maxWidth: '500px', margin: '0 auto', paddingTop: '50px'}}>
        <h2 className="page-header">仓库选择</h2>
        <div>
          <Select
            style={{ width: '25%' }}
            value={this.state.type}
            onChange={this.onStoreTypeChange}
          >
            {STORE2TYPE.map(type => <Select.Option
              key={type}
              value={type}
            >{type}</Select.Option>)}
          </Select>
          <Select
            style={{ width: '72%', float: 'right' }}
            value={this.state.base}
            placeholder='选择仓库'
            showSearch
            onChange={this.onBaseChange}
            filterOption={filterOption}
            clearable={false}
          >
            {filteredProjects.filter(project => project.type === this.state.type).toArray().map(project =>
              <Select.Option
                pinyin={project.pinyin}
                key={project._id}
                value={project._id}
              >{project.company + project.name}</Select.Option>
            )}
          </Select>
          <Button style={{marginTop: '1em'}} variant="contained" color="primary" fullWidth onClick={this.onBaseSelect}>进入管理</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  system: state.system,
  user: state.system.user,
  config: state.system.config,
})

export default connect(mapStateToProps)(CurrentStore)