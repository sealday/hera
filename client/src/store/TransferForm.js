import React, { Component } from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form'
import { Input, DatePicker, FilterSelect, TextArea } from '../components'
import Tabs, { Tab } from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { connect } from 'react-redux'
import moment from 'moment'
import EntryTable from './TransferEntryTable'
import {
  filterOption,
  validator,
  theme,
} from '../utils'

class TransferForm extends Component {
  state = {
    tab: 0,
  }

  handleTabChange = (event, tab) => {
    this.setState({ tab });
  };

  render() {
    const { tab } = this.state;
    return (
      <form className="form-horizontal" onSubmit={this.props.handleSubmit}>
        <div className="form-group">
          <label className="control-label col-md-1">项目部</label>
          <div className="col-md-3">
            <Field
              name="project"
              component={FilterSelect}
              validate={validator.required}
              options={this.props.projects.map(project => ({
                value: project._id,
                label: project.company + project.name,
                pinyin: project.pinyin
              }))}
              filterOption={filterOption}
              placeholder="请选择项目" />
          </div>
          <label className="control-label col-md-1">日期</label>
          <div className="col-md-3">
            <Field name="outDate" component={DatePicker}/>
          </div>
          <label className="control-label col-md-1">原始单号</label>
          <div className="col-md-3">
            <Field name="originalOrder" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">车号</label>
          <div className="col-md-3">
            <Field name="carNumber" component={Input}/>
          </div>
          <label className="control-label col-md-1">运费</label>
          <div className="col-md-3">
            <Field name="fee.car" component={Input}/>
          </div>
          <label className="control-label col-md-1">整理费用</label>
          <div className="col-md-3">
            <Field name="fee.sort" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">其他费用1</label>
          <div className="col-md-3">
            <Field name="fee.other1" component={Input}/>
          </div>
          <label className="control-label col-md-1">其他费用2</label>
          <div className="col-md-3">
            <Field name="fee.other2" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">备注</label>
          <div className="col-md-11">
            <Field name="comments" component={TextArea}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-12">
            <MuiThemeProvider theme={theme}>
              <Tabs value={tab} onChange={this.handleTabChange}>
                <Tab label="租赁" />
                <Tab label="销售" />
                <Tab label="赔偿" />
                <Tab label="维修" />
              </Tabs>
            </MuiThemeProvider>
            { tab === 0 && <FieldArray name="entries1" component={EntryTable}/>}
            { tab === 1 && <FieldArray name="entries2" component={EntryTable}/>}
            { tab === 2 && <FieldArray name="entries3" component={EntryTable}/>}
            { tab === 3 && <FieldArray name="entries4" component={EntryTable}/>}
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-12">
            <button type="submit" className="btn btn-primary btn-block">保存</button>
          </div>
        </div>
      </form>
    );
  }
}

TransferForm = reduxForm({
  form: 'transfer',
  initialValues: {
    outDate: moment()
  }
})(TransferForm)

const mapStateToProps = state => ({
  projects: state.system.projects.toArray(),
  stocks: state.store.stocks,
})

export default connect(mapStateToProps)(TransferForm);