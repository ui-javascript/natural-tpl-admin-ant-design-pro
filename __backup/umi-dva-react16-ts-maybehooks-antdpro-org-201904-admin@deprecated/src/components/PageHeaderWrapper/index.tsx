import PageHeader from '@/components/PageHeader';
import MenuContext from '@/layouts/MenuContext';
import { connect } from 'dva';
import React from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import GridContent from './GridContent';
import styles from './index.less';
import { SettingModelState } from '@/models/setting';

interface PageHeaderWrapperProps {
  contentWidth: string;
  wrapperClassName: string;
  top: JSX.Element;
}
const PageHeaderWrapper: React.FC<PageHeaderWrapperProps> = ({
  children,
  contentWidth,
  wrapperClassName,
  top,
  ...restProps
}) => (
  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    <MenuContext.Consumer>
      {value => (
        <PageHeader
          wide={contentWidth === 'Fixed'}
          home={<FormattedMessage id="menu.home" defaultMessage="Home" />}
          {...value}
          key="pageheader"
          {...restProps}
          linkElement={Link}
          itemRender={item => {
            if (item.locale) {
              return <FormattedMessage id={item.locale} defaultMessage={item.title} />;
            }
            return item.title;
          }}
        />
      )}
    </MenuContext.Consumer>
    {children ? (
      <div className={styles.content}>
        <GridContent>{children}</GridContent>
      </div>
    ) : null}
  </div>
);

export default connect(({ setting }: { setting: SettingModelState }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
