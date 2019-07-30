import { Icon, Tag } from 'antd';
import classNames from 'classnames';
import React, { Component } from 'react';

import styles from './index.less';

const { CheckableTag } = Tag;

interface TagSelectOptionProps {
  value?: string | number;
  style?: React.CSSProperties;
  checked?: boolean;
  onChange?: (value: string | number, state: boolean) => void;
}

interface TagSelectOptionType extends React.FC<TagSelectOptionProps> {
  isTagSelectOption?: boolean;
}

const TagSelectOption: TagSelectOptionType = ({
  children,
  checked = false,
  onChange,
  value = '',
}) => (
  <CheckableTag
    checked={checked}
    key={value}
    onChange={state => onChange && onChange(value, state)}
  >
    {children}
  </CheckableTag>
);

TagSelectOption.isTagSelectOption = true;

interface TagSelectProps {
  onChange?: (value: string[]) => void;
  expandable?: boolean;
  value?: string[] | number[];
  defaultValue?: string[] | number[];
  style?: React.CSSProperties;
  hideCheckAll?: boolean;
  actionsText?: {
    expandText?: React.ReactNode;
    collapseText?: React.ReactNode;
    selectAllText?: React.ReactNode;
  };
  className?: string;
  Option?: TagSelectOptionProps;
  children: React.ReactElement<TagSelectOption> | Array<React.ReactElement<TagSelectOption>>;
}

interface TagSelectState {
  value: any[];
  expand: boolean;
}
class TagSelect extends Component<TagSelectProps, TagSelectState> {
  static defaultProps = {
    hideCheckAll: false,
    actionsText: {
      expandText: 'Expand',
      collapseText: 'Collapse',
      selectAllText: 'All',
    },
  };

  public static Option: typeof TagSelectOption;

  static getDerivedStateFromProps(nextProps: TagSelectProps) {
    if ('value' in nextProps) {
      return { value: nextProps.value || [] };
    }
    return null;
  }

  constructor(props: TagSelectProps) {
    super(props);
    this.state = {
      expand: false,
      value: props.value || props.defaultValue || [],
    };
  }

  onChange = (value: any[]) => {
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    if (onChange) {
      onChange(value);
    }
  };

  onSelectAll = (checked: boolean) => {
    let checkedTags: any[] = [];
    if (checked) {
      checkedTags = this.getAllTags();
    }
    this.onChange(checkedTags);
  };

  getAllTags() {
    let { children } = this.props;
    children = React.Children.toArray(children) as Array<React.ReactElement<TagSelectOption>>;
    const checkedTags = children
      .filter(child => this.isTagSelectOption(child))
      .map(child => child.props.value);
    return checkedTags || [];
  }

  handleTagChange = (value: any, checked: any) => {
    const { value: StateValue } = this.state;
    const checkedTags = [...StateValue];

    const index = checkedTags.indexOf(value);
    if (checked && index === -1) {
      checkedTags.push(value);
    } else if (!checked && index > -1) {
      checkedTags.splice(index, 1);
    }
    this.onChange(checkedTags);
  };

  handleExpand = () => {
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  };

  isTagSelectOption = (node: any) =>
    node &&
    node.type &&
    (node.type.isTagSelectOption || node.type.displayName === 'TagSelectOption');

  render() {
    const { value, expand } = this.state;
    const { children, hideCheckAll, className, style, expandable, actionsText } = this.props;
    const checkedAll = this.getAllTags().length === value.length;
    const actionsTextObj: any = actionsText === null ? {} : actionsText;
    const {
      expandText = 'Expand',
      collapseText = 'Collapse',
      selectAllText = 'All',
    } = actionsTextObj;

    const cls = classNames(styles.tagSelect, className, {
      [styles.hasExpandTag]: expandable,
      [styles.expanded]: expand,
    });

    return (
      <div className={cls} style={style}>
        {hideCheckAll ? null : (
          <CheckableTag checked={checkedAll} key="tag-select-__all__" onChange={this.onSelectAll}>
            {selectAllText}
          </CheckableTag>
        )}
        {value &&
          React.Children.map(children, (child: React.ReactElement<TagSelectOption>) => {
            if (this.isTagSelectOption(child)) {
              return React.cloneElement(child, {
                key: `tag-select-${child.props.value}`,
                value: child.props.value,
                checked: value.indexOf(child.props.value) > -1,
                onChange: this.handleTagChange,
              });
            }
            return child;
          })}
        {expandable && (
          <a className={styles.trigger} onClick={this.handleExpand}>
            {expand ? collapseText : expandText} <Icon type={expand ? 'up' : 'down'} />
          </a>
        )}
      </div>
    );
  }
}

TagSelect.Option = TagSelectOption;

export default TagSelect;
