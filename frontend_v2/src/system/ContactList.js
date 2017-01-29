/**
 * Created by seal on 22/01/2017.
 */

import React, { Component } from 'react'
import Contact from './Contact'

class ContactList extends Component {
  handleContactChange = (key, name, value) => {
    let contacts = [...this.props.input.value]
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].key === key) {
        contacts[i] = {
          ...contacts[i],
          [name]: value
        }
      }
    }
    this.props.input.onChange(contacts)
  }

  handleContactAdd = () => {
    this.props.input.onChange([
      ...this.props.input.value, { key: Date.now(), name: '', phone: '' }
    ])
  }

  handleContactRemove = (key) => {
    if (this.props.input.value.length === 1) {
      return;
    }
    let contacts = [...this.props.input.value];
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].key === key) {
        contacts.splice(i, 1);
      }
    }
    this.props.input.onChange(contacts)
  }

  render() {
    return (
      <div>
        {this.props.input.value.map(contact => (
          <Contact
            key={contact.key}
            id={contact.key}
            name={contact.name}
            phone={contact.phone}
            onChange={this.handleContactChange}
            onAdd={this.handleContactAdd}
            onRemove={this.handleContactRemove} />
        ))}
      </div>
    )
  }
}

export default ContactList
