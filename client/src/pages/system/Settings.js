import React, { Component } from 'react'
import { connect } from 'react-redux'

import SettingsForm from './SettingsForm.js'
import { saveSettings } from '../../actions'
import { wrapper } from '../../utils'
import { PageHeader } from '../../components'


class Home extends Component {

  handleSubmit(settings) {
    this.props.dispatch(saveSettings(settings))
  }

  render() {
    const { config } = this.props
    return (
      <PageHeader title='基础配置'>
        <SettingsForm
          initialValues={{
            systemName: config.systemName,
            externalNames: config.externalNames,
            printSideComment: config.printSideComment,
            posts: config.posts || [],
          }}
          onSubmit={this.handleSubmit.bind(this)}
        />
      </PageHeader>
    )
  }
}

const mapStateToProps = state => ({
  config: state.system.config,
})

export default wrapper([
  connect(mapStateToProps),
  Home,
])
