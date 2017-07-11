/**
 * Created by seal on 7/11/17.
 */
import React from 'react'
import { connect } from 'react-redux'
import ProfileForm from './ProfileForm'

class Profile extends React.Component {
  handleSubmit(profile) {
    alert('功能暂未实现')
  }
  render() {
    return (
      <div>
        <ProfileForm
          initialValues={this.props.user}
          onSubmit={this.handleSubmit}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.system.user,
  }
}

export default connect(mapStateToProps)(Profile)
