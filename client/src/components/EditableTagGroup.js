import React from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Tag, Input, Tooltip } from 'antd';

class EditableTagGroup extends React.Component {
  state = {
    inputVisible: false,
    inputValue: '',
  };

  handleClose = removedTag => {
    const { tags, onChange } = this.props
    // 不允许少于一项 TODO 如果有需要可以改成配置项
    if (tags.length > 1) {
      onChange(tags.filter(tag => tag !== removedTag))
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { tags: value, onChange } = this.props
    const { inputValue } = this.state;
    let tags = value
    if (inputValue && value.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      inputVisible: false,
      inputValue: '',
    })
    onChange(tags)
  }

  saveInputRef = input => (this.input = input);

  render() {
    const { inputVisible, inputValue } = this.state;
    const { tags } = this.props
    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            // 不允许少于一项 TODO 如果有需要可以改成配置项
            <Tag key={tag} closable={tags.length > 1} onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <PlusOutlined /> 新增
          </Tag>
        )}
      </div>
    );
  }
}

export default EditableTagGroup
