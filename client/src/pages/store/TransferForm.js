import React, { Component } from 'react'
import { reduxForm, Field, FieldArray } from 'redux-form'
import { connect } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  withStyles,
} from '@material-ui/core'

import EntryTable from './TransferEntryTable'
import {
  filterOption,
  validator,
  getProjects,
} from '../../utils'
import { Input, DatePicker, FilterSelect, TextArea } from '../../components'

const styles = () => ({
  header: {
    padding: 16,
  },
  panel: {
    flexDirection: 'column'
  },
  submitButton: {
    width: '100%',
    marginTop: 16,
  }
})

class TransferForm extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { classes, title, action } = this.props
    const projects = this.props.projects.toArray()
    return (
      <form className="form-horizontal" onSubmit={this.props.handleSubmit}>
        <Card>
          <CardHeader title={title} action={action}/>
          <CardContent>
            <div className="form-group">
              <label className="control-label col-md-1">项目部</label>
              <div className="col-md-3">
                <Field
                  name="project"
                  component={FilterSelect}
                  validate={validator.required}
                  options={getProjects(projects).map(project => ({
                    value: project._id,
                    label: project.company + project.name,
                    pinyin: project.pinyin
                  }))}
                  filterOption={filterOption}
                  placeholder="请选择项目"
                />
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
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">备注</label>
              <div className="col-md-11">
                <Field name="comments" component={TextArea}/>
              </div>
            </div>
            <div className="form-group">
              <div className="col-md-12">
                <FieldArray name="entries" component={EntryTable} mode="L" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Button variant="contained" color="primary" type="submit" className={classes.submitButton}>保存</Button>
      </form>
    )
  }
}

TransferForm = reduxForm({
  form: 'transfer',
  initialValues: {
    outDate: moment(),
  }
})(TransferForm)

const mapStateToProps = state => ({
  projects: state.system.projects,
  stocks: state.store.stocks,
})

export default connect(mapStateToProps)(withStyles(styles)(TransferForm))
