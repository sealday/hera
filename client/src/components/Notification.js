import React from 'react'
import { connect } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'

const Notification = ({ items }) => (
  <div className="hidden-print">
    {items.valueSeq().map(item => (
      <Snackbar
        key={item.key}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={true}
        message={<span>{item.title} - {item.msg}</span>}
      />
    ))}
  </div>
)

const mapStateToProps = state => ({
  items: state.system.notifications,
})

export default connect(mapStateToProps)(Notification)