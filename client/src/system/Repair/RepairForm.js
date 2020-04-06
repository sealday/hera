import React, {Component} from 'react'
import {Field, FieldArray} from 'redux-form'
import {Input, DatePicker, TextArea} from '../../components'
import {validator} from '../../utils'
import RepairEntry from './RepairEntry'

class RepairForm extends Component {
	render() {
		return (
			<form onSubmit={this.props.handleSubmit}>
				<div>
					<div className="form-group">
						<label className="control-label col-md-1">名称</label>
						<div className="col-md-3">
							<Field name="name" component={Input} validate={[validator.required]} />
						</div>
						<label className="control-label col-md-1">日期</label>
						<div className="col-md-3">
							<Field name="date" component={DatePicker} validate={[validator.required]} />
						</div>
					</div>
				</div>
				<div className="form-group">
					<label className="control-label col-md-1">备注</label>
					<div className="col-md-11">
						<Field name="comments" component={TextArea} />
					</div>
				</div>
				<FieldArray name="entries" component={RepairEntry} />
			</form>
		)
	}
}

export default RepairForm
