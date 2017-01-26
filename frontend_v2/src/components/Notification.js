/**
 * Created by seal on 26/01/2017.
 */
import React from 'react'
import './Notification.css'
import { connect } from 'react-redux'
import { deleteNotify } from '../actions'

const Notification = ({ items, dispatch }) => (
  <div className="notify-container">
    {items.valueSeq().map(item => (
      <Item
        id={item.key}
        {...item}
        hide={key => dispatch(deleteNotify(key))}
      />
    ))}
  </div>
)

const Item = ({ id, hide, key, title, theme, msg }) => (
  <div className={`notify-item ${theme}`} onClick={() => hide(id)}>
    <p className="notify-title">{title}</p>
    <p className="notify-body">{msg}</p>
  </div>
)

const mapStateToProps = state => ({
  items: state.system.notifications
})

export default connect(mapStateToProps)(Notification)