import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'

class ContractFormDialog extends React.Component {

  render() {
    const { handleSubmit, open, onClose } = this.props
    return (
      <Dialog
        open={open}
        TransitionComponent={Fade}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>对账单编辑</DialogTitle>
          <DialogContent>
            <Field
              name="taxRate"
              component="input"
              style={{ width: '100%' }}
              props={{
                label: '税率',
                type: 'number',
                inputProps: {
                  step: 0.01,
                  min: 0,
                  max: 1,
                }
              }}
              type="number"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>取消</Button>
            <Button type="submit" color="primary">确认</Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

ContractFormDialog = reduxForm({
  form: 'contractFormDialog',
})(ContractFormDialog)


const mapStateToProps = state => {
  return {
    projects: state.system.projects.toArray(),
  }
}

export default connect(mapStateToProps)(ContractFormDialog)
