/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { FilterSelect } from '../components'
import { connect } from 'react-redux'
import { filterOption, validator } from '../utils'

/**
 * 搜索用的表单
 */
class ContractForm extends React.Component {

  getStockOptions = projects => {
    return [
      {
        value: '',
        label: '显示全部',
        pinyin: 'xianshiquanbu'
      }
    ].concat(projects.filter(project => project.type !== '基地仓库').map(project => ({
      value: project._id,
      label: project.company + project.name,
      pinyin: project.pinyin
    })))
  }

  render() {
    const { handleSubmit, projects } = this.props
    return (
      <form onSubmit={handleSubmit} className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-md-1">过滤</label>
          <div className="col-md-5">
            <Field name="project"
                   component={FilterSelect}
                   options={this.getStockOptions(projects)}
                   validate={[validator.required]}
                   filterOption={filterOption}
            />
          </div>
        </div>
      </form>
    )
  }
}

ContractForm = reduxForm({
  form: 'contractForm',
})(ContractForm)


const mapStateToProps = state => {

  return {
    projects: state.system.projects.toArray(),
  }
}

export default connect(mapStateToProps)(ContractForm)
