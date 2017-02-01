/**
 * Created by seal on 10/01/2017.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'

class Home extends Component {
  render() {
    return (
      <div>
        <div>
          公告栏
        </div>
        <div>
          人事变动通知
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  system: state.system
})

export default connect(mapStateToProps)(Home);
