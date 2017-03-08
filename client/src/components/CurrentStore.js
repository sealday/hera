/**
 * Created by seal on 30/01/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { selectStore } from '../actions'
import { filterOption } from '../utils'

class CurrentStore extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      project: '',
      base: props.system.base._id,
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
    this.props.dispatch(selectStore(this.props.system.projects.get(this.state.base)))
  }

  onProjectSelect = () => {
    this.props.dispatch(selectStore(this.props.system.projects.get(this.state.project)))
  }

  onOtherSelect = () => {
    this.props.dispatch(selectStore(this.props.system.projects.get(this.state.other)))
  }

  render() {
    const props = this.props
    return (
      <div style={{maxWidth: '500px', margin: '0 auto', paddingTop: '50px'}}>
        <h2 className="page-header">仓库选择</h2>
        <div>
          <Select
            value={this.state.base}
            placeholder='选择仓库'
            onChange={e => this.onBaseChange(e.value)}
            clearable={false}
            filterOption={filterOption}
            options={props.system.projects.filter(project => project.type === '基地仓库').toArray().map(project =>
              ({ value: project._id, label: project.company + project.name, pinyin: project.pinyin }))}
          />
          <button style={{marginTop: '1em'}} className="btn btn-primary btn-block" onClick={this.onBaseSelect}>基地管理</button>
        </div>
        <div style={{marginTop: '2em'}}>
          <Select
            value={this.state.project}
            placeholder='选择项目'
            onChange={e => this.onProjectChange(e.value)}
            clearable={false}
            filterOption={filterOption}
            options={props.system.projects.filter(project => project.type === '项目部仓库').toArray().map(project =>
              ({ value: project._id, label: project.company + project.name, pinyin: project.pinyin }))}
          />
          <button style={{marginTop: '1em'}} className="btn btn-primary btn-block" onClick={this.onProjectSelect}>项目部管理</button>
        </div>
        <div style={{marginTop: '2em'}}>
          <Select
            value={this.state.other}
            placeholder='选择项目'
            onChange={e => this.onOtherChange(e.value)}
            clearable={false}
            filterOption={filterOption}
            options={props.system.projects.filter(project => project.type === '第三方仓库').toArray().map(project =>
              ({ value: project._id, label: project.company + project.name, pinyin: project.pinyin }))}
          />
          <button style={{marginTop: '1em'}} className="btn btn-primary btn-block" onClick={this.onOtherSelect}>第三方管理</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  system: state.system
})

export default connect(mapStateToProps)(CurrentStore)