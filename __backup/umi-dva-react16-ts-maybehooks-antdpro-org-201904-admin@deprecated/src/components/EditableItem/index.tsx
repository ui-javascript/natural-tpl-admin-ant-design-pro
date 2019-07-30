import { Icon, Input } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';

interface EditableItemProps {
  onChange: (value?: string | string[] | number) => void;
  value?: string | string[] | number;
}

interface EditableItemState {
  value?: string | string[] | number;
  editable: boolean;
}

export default class EditableItem extends Component<EditableItemProps, EditableItemState> {
  constructor(props: EditableItemProps) {
    super(props);
    this.state = {
      value: props.value,
      editable: false,
    };
  }

  handleChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    this.setState({ value });
  };

  check = () => {
    this.setState({ editable: false });
    const { value } = this.state;
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  edit = () => {
    this.setState({ editable: true });
  };

  render() {
    const { value, editable } = this.state;
    return (
      <div className={styles.editableItem}>
        {editable ? (
          <div className={styles.wrapper}>
            <Input value={value} onChange={this.handleChange} onPressEnter={this.check} />
            <Icon type="check" className={styles.icon} onClick={this.check} />
          </div>
        ) : (
          <div className={styles.wrapper}>
            <span>{value || ' '}</span>
            <Icon type="edit" className={styles.icon} onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}
