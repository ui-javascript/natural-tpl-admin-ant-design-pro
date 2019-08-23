import React, { Component } from 'react';
import { Table, Pagination, Tooltip } from 'antd';
import objectAssign from 'object-assign';
import isEqual from 'react-fast-compare';
import $$ from 'cmn-utils';
import cx from 'classnames';
import { EditableCell } from './Editable';
import './index.less';

/**
 * 数据表格
 */
class DataTable extends Component {
  static defaultProps = {
    prefixCls: 'antui-datatable',
    alternateColor: true
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: props.selectedRowKeys,
      selectedRows: this.getSelectedRows(props.selectedRowKeys),
      tableHeight: null
    };
  }

  // 将值转成对像数组
  getSelectedRows(value, oldValue = []) {
    const { rowKey } = this.props;
    if (value) {
      return value.map(item => {
        const oldv = oldValue.filter(jtem => jtem[rowKey] === item)[0];
        return typeof item === 'object' ? item : oldv || { [rowKey]: item };
      });
    }
    return [];
  }

  componentWillReceiveProps(nextProps) {
    const { selectedRows } = this.state;
    const newState = {};
    if (!isEqual(this.props.selectedRowKeys, nextProps.selectedRowKeys)) {
      newState.selectedRowKeys = nextProps.selectedRowKeys;
      newState.selectedRows = this.getSelectedRows(
        nextProps.selectedRowKeys,
        selectedRows
      );
      this.setState(newState);
    }
  }

  tableOnRow = (record, index) => {
    const { selectType } = this.props;

    const keys = selectType === 'radio' ? [] : this.state.selectedRowKeys || [];
    const rows = selectType === 'radio' ? [] : this.state.selectedRows || [];

    const i = keys.indexOf(record[this._rowKey]);
    if (i !== -1) {
      keys.splice(i, 1);
      rows.splice(i, 1);
    } else {
      keys.push(record[this._rowKey]);
      rows.push(record);
    }

    this.onSelectChange(keys, rows);
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // 使用keys重新过滤一遍rows以key为准，解决keys与rows不同步问题
    // 并在每一行加一个rowKey字段
    selectedRows = selectedRows.filter(
      item => selectedRowKeys.indexOf(item[this._rowKey]) !== -1
    );

    this.setState({ selectedRowKeys, selectedRows }, () => {
      this.props.onSelect && this.props.onSelect(selectedRowKeys, selectedRows);
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pageNum = pagination.current || pagination;

    const sortMap = sorter.field
      ? {
          [sorter.field]: sorter.order === 'ascend' ? 'asc' : 'desc'
        }
      : sorter;
    this.props.onChange &&
      this.props.onChange({ pageNum, filters, sorter: sortMap });
  };

  onShowSizeChange = (pageNum, pageSize) => {
    this.props.onChange && this.props.onChange({ pageNum, pageSize });
  };

  render() {
    const {
      prefixCls,
      className,
      columns,
      dataItems,
      showNum,
      alternateColor,
      onChange,
      selectType,
      rowSelection,
      isScroll,
      pagination,
      rowKey,
      ...otherProps
    } = this.props;

    const classname = cx(prefixCls, className, {
      'table-row-alternate-color': alternateColor
    });

    let colRowKey = '';
    // 默认宽度
    const cols = columns
      .filter(col => {
        if (col.primary) colRowKey = col.name;
        if (col.tableItem) {
          return true;
        }
          return false;

      })
      .map(col => {
        const item = col.tableItem;
        // select 字典加强
        if (col.dict && !item.render) {
          item.render = (text, record) => (
              col.dict &&
              col.dict
                .filter(dic => dic.code === text)
                .map(dic => dic.codeName)[0]
            );
        }
        // 如果指定了type字段，则使用指定类型渲染这个列
        const myRender = item.render;
        if (item.type) {
          item.render = (text, record, index) => {
            if ($$.isFunction(item.editing) && item.editing(text, record)) {
              return (
                <EditableCell
                  text={text}
                  record={record}
                  index={index}
                  field={col}
                />
              );
            }
              return $$.isFunction(myRender)
                ? myRender(text, record, index)
                : text;

          };
        }
        return {
          title: col.title,
          dataIndex: col.name,
          ...item
        };
      })
      // 保存rowkey在record
      .concat({
        dataIndex: '_rowkey',
        width: 0,
        render(text, record, index) {
          record.rowKey = record[rowKey || colRowKey];
          return <div style={{ display: 'none' }}>{record.rowKey}</div>;
        }
      });

    // 显示行号
    if (showNum) {
      cols.unshift({
        title: '序号',
        width: 50,
        dataIndex: '_num',
        render(text, record, index) {
          const { pageNum, pageSize } = dataItems;
          if (pageNum && pageSize) {
            return (pageNum - 1) * pageSize + index + 1;
          }
          // 没有分页
          return index + 1;

        }
      });
    }

    // 分页
    const paging = objectAssign(
      {
        total: dataItems.total,
        pageSize: dataItems.pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        onShowSizeChange: this.onShowSizeChange
      },
      dataItems.pageNum && { current: dataItems.pageNum },
      pagination
    );

    const _rowSelection = {
      type: selectType === 'radio' ? 'radio' : 'checkbox',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      ...rowSelection
    };

    this._rowKey = rowKey || colRowKey;

    return (
      <div className={classname}>
        <Table
          size="small"
          rowSelection={selectType ? _rowSelection : null}
          onRow={
            selectType
              ? (record, index) => ({
                  onClick: _ => this.tableOnRow(record, index)
                })
              : () => {}
          }
          scroll={isScroll ? objectAssign({ x: true }) : {}}
          bodyStyle={{ overflowX: 'auto' }}
          columns={cols}
          pagination={pagination ? paging : false}
          dataSource={dataItems.list}
          onChange={this.handleTableChange}
          rowKey={this._rowKey}
          {...otherProps}
        />
      </div>
    );
  }
}

/**
 * 操作区 阻止向上冒泡
 */
export const Oper = prop => (
  <div className="table-row-button" onClick={e => e.stopPropagation()}>
    {prop.children}
  </div>
);

export const Tip = prop => (
  <Tooltip placement="topLeft" title={prop.children}>
    <div className="nobr" style={prop.style}>
      {prop.children}
    </div>
  </Tooltip>
);

export const Paging = ({ dataItems, onChange, ...otherProps }) => {
  const { total, pageSize, pageNum } = dataItems;
  const paging = {
    total: total,
    pageSize: pageSize,
    current: pageNum,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: totalz => `共 ${totalz} 条`,
    onShowSizeChange: (pageNumz, pageSizez) => onChange({ pageNumz, pageSizez }),
    onChange: pageNumz => onChange({ pageNumz }),
    ...otherProps
  };
  return <Pagination {...paging} />;
};

DataTable.Oper = Oper;
DataTable.Pagination = Paging;
DataTable.Tip = Tip;

export default DataTable;
