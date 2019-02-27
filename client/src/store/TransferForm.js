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
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  withStyles,
} from '@material-ui/core'
import {
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons'

import EntryTable from './TransferEntryTable'
import {
  filterOption,
  validator,
} from '../utils'
import { Input, DatePicker, FilterSelect, TextArea } from '../components'

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
    const { direction, classes, title, action, projects } = this.props
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
                  options={projects.map(project => ({
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
          </CardContent>
        </Card>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="title">{direction === 'in' ? '租赁（入库）' : '租赁（出库）'}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.panel}>
            <FieldArray name="entries" component={EntryTable} mode="L"/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="title">{direction === 'in' ? '销售（入库）' : '销售（出库）'}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.panel}>
            <FieldArray name="entries" component={EntryTable} mode="S"/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="title">{direction === 'in' ? '赔偿（出库）' : '赔偿（入库）'}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.panel}>
            <FieldArray name="entries" component={EntryTable} mode="C"/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="title">服务（维修或者运费等不影响库存）</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.panel}>
            <FieldArray name="entries" component={EntryTable} mode="R"/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Button variant="raised" color="primary" type="submit" className={classes.submitButton}>保存</Button>
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
  projects: state.system.projects.toArray(),
  stocks: state.store.stocks,
})

export default connect(mapStateToProps)(withStyles(styles)(TransferForm))