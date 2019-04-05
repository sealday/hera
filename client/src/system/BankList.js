import React, { Component } from 'react'
import Bank from './Bank'

class BankList extends Component {

  handleBankChange = (key, name, value) => {
    let banks = [...this.props.input.value]
    for (let i = 0; i < banks.length; i++) {
      if (banks[i].key === key) {
        banks[i] = {
          ...banks[i],
          [name]: value
        }
      }
    }
    this.props.input.onChange(banks)
  }

  handleBankAdd = () => {
    this.props.input.onChange([
      ...this.props.input.value, { key: Date.now(), name: '', bank: '', account: '', }
    ])
  }

  handleBankRemove = key => {
    if (this.props.input.value.length === 1) {
      return;
    }
    let banks = [...this.props.input.value];
    for (let i = 0; i < banks.length; i++) {
      if (banks[i].key === key) {
        banks.splice(i, 1);
      }
    }
    this.props.input.onChange(banks)
  }

  render() {
    return (
      <div>
        {this.props.input.value.map(bank => (
          <Bank
            key={bank.key}
            id={bank.key}
            name={bank.name}
            bank={bank.bank}
            account={bank.account}
            onChange={this.handleBankChange}
            onAdd={this.handleBankAdd}
            onRemove={this.handleBankRemove} />
        ))}
      </div>
    )
  }
}

export default BankList
