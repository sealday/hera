import React from 'react'
import { connect } from 'react-redux'
import { Select, Button, Card, Row, Col } from 'antd'

import { selectStore } from '../actions'
import { filterOption, filterProjects, STORE2TYPE } from '../utils'

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
    const filteredProjects = filterProjects(projects, user)
    return (
      <Card bordered={false} title='仓库选择' style={{ width: '600px', margin: '12px auto' }}>
        <Row gutter={24}>
          <Col flex='125px'>
            <Select
              style={{ width: '100%' }}
              value={this.state.type}
              onChange={this.onStoreTypeChange}
            >
              {STORE2TYPE.map(type => <Select.Option
                key={type}
                value={type}
              >{type}</Select.Option>)}
            </Select>
          </Col>
          <Col flex='auto'>
            <Select
              style={{ width: '100%' }}
              value={this.state.base}
              placeholder='仓库选择'
              showSearch
              onChange={this.onBaseChange}
              filterOption={filterOption}
              clearable={false}
            >
              {filteredProjects.filter(project => project.type === this.state.type).valueSeq().toArray().map(project =>
                <Select.Option
                  pinyin={project.pinyin}
                  label={project.company + project.name}
                  key={project._id}
                  value={project._id}
                >{project.company + project.name}</Select.Option>
              )}
            </Select>
          </Col>
          <Col span={24}>
            <Button style={{ marginTop: '24px' }} type='primary' block onClick={this.onBaseSelect}>进入管理</Button>
          </Col>
        </Row>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  system: state.system,
  user: state.system.user,
  config: state.system.config,
})

export default connect(mapStateToProps)(CurrentStore)
