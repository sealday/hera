import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  Grid,
} from '@material-ui/core'

import SettingsForm from './SettingsForm.js'
import { saveSettings } from '../../actions'
import { wrapper } from '../../utils'

const style = theme => ({})

class Home extends Component {

  handleSubmit(settings) {
    this.props.dispatch(saveSettings(settings))
  }

  render() {
    const { config } = this.props
    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <SettingsForm 
            initialValues={{
              systemName: config.systemName,
              externalNames: config.externalNames,
              printSideComment: config.printSideComment,
            }}
          onSubmit={this.handleSubmit.bind(this)}
          />
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  config: state.system.config,
})

export default wrapper([
  connect(mapStateToProps),
  withStyles(style),
  Home,
])
