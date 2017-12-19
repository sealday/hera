/**
 * Created by seal on 7/11/17.
 */
import React from 'react'
import { connect } from 'react-redux'
import { saveProfile } from '../actions'
import ProfileForm from './ProfileForm'

class Profile extends React.Component {
  handleSubmit(profile) {
    this.props.dispatch(saveProfile({
      ...profile,
      _id: this.props.user._id
    }))
  }
  render() {
    return (
      <div>
        <ProfileForm
          initialValues={{ ...this.props.user, password: undefined }}
          onSubmit={this.handleSubmit.bind(this)}
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
